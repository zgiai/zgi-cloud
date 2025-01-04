from typing import List, Dict, Any, Optional
import weaviate
from ..base import VectorDBProvider

class WeaviateProvider(VectorDBProvider):
    """Weaviate vector database provider"""
    
    def __init__(self, url: str, api_key: str = None, **kwargs):
        """Initialize Weaviate provider
        
        Args:
            url: Weaviate server URL
            api_key: Optional API key
        """
        auth_config = weaviate.auth.AuthApiKey(api_key) if api_key else None
        self.client = weaviate.Client(
            url=url,
            auth_client_secret=auth_config
        )
    
    async def create_collection(
        self,
        name: str,
        dimension: int,
        **kwargs
    ) -> bool:
        """Create a new Weaviate class"""
        try:
            class_obj = {
                "class": name,
                "vectorizer": "none",  # We'll provide vectors directly
                "vectorIndexConfig": {
                    "distance": kwargs.get('metric', 'cosine'),
                    "dimension": dimension
                },
                "properties": [
                    {
                        "name": "metadata",
                        "dataType": ["object"],
                        "description": "Vector metadata",
                        "nestedProperties": [
                            {
                                "name": "text",
                                "dataType": ["text"],
                                "description": "The text content"
                            },
                            {
                                "name": "document_id",
                                "dataType": ["int"],
                                "description": "The document id"
                            },
                            {
                                "name": "chunk_index",
                                "dataType": ["int"],
                                "description": "chunk index"
                            }
                        ]
                    }
                ]
            }
            self.client.schema.create_class(class_obj)
            return True
        except Exception as e:
            print(f"Error creating Weaviate class: {e}")
            return False
    
    async def delete_collection(self, name: str) -> bool:
        """Delete a Weaviate class"""
        try:
            self.client.schema.delete_class(name)
            return True
        except Exception as e:
            print(f"Error deleting Weaviate class: {e}")
            return False
    
    async def insert_vectors(
        self,
        collection_name: str,
        vectors: List[List[float]],
        metadata: List[Dict[str, Any]]
    ) -> bool:
        """Insert vectors into Weaviate class"""
        try:
            # Insert vectors in batches
            with self.client.batch(
                batch_size=100,
                dynamic=True,
                timeout_retries=3
            ) as batch:
                for vector, meta in zip(vectors, metadata):
                    batch.add_data_object(
                        data_object={"metadata": meta},
                        class_name=collection_name,
                        vector=vector
                    )
            return True
        except Exception as e:
            print(f"Error inserting vectors into Weaviate: {e}")
            return False
    
    async def search(
        self,
        collection_name: str,
        query_vector: List[float],
        top_k: int = 5,
        score_threshold: Optional[float] = None,
        metadata_filter: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """Search similar vectors in Weaviate class"""
        try:
            # Ensure collection_name is in PascalCase
            collection_name = collection_name.capitalize()
            # Build query
            query = (
                self.client.query
                .get(collection_name, ["metadata{document_id chunk_index text}"])
                .with_additional(["id", "certainty"])
                .with_near_vector({
                    "vector": query_vector,
                    "certainty": score_threshold if score_threshold else 0.7
                })
                .with_limit(top_k)
            )
            
            # Add metadata filter if specified
            if metadata_filter:
                where_filter = {
                    "operator": "And",
                    "operands": [{
                        "path": ["metadata", key],
                        "operator": "Equal",
                        "valueString": str(value)
                    } for key, value in metadata_filter.items()]
                }
                query = query.with_where(where_filter)
            
            # Execute query
            results = query.do()
            
            # Format results
            items = results.get('data', {}).get('Get', {}).get(collection_name, [])
            return [{
                'id': item.get('_additional', {}).get('id'),
                'score': item.get('_additional', {}).get('certainty'),
                'metadata': item.get('metadata', {})
            } for item in items]
        except Exception as e:
            print(f"Error searching vectors in Weaviate: {e}")
            return []
    
    async def get_collection_info(self, name: str) -> Dict[str, Any]:
        """Get Weaviate class information"""
        try:
            schema = self.client.schema.get(name)
            return {
                'name': name,
                'vectorizer': schema.get('vectorizer'),
                'vector_index_config': schema.get('vectorIndexConfig'),
                'properties': schema.get('properties')
            }
        except Exception as e:
            print(f"Error getting Weaviate class info: {e}")
            return {}
