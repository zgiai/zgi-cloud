import ModalAction from '@/components/modal-action';
import { createKnowledgeBase, deleteKnowledgeBase, updateKnowledgeBase } from '@/services/knowledgeBase';
import { message } from 'antd';
import { useState,useEffect } from 'react';
import { useAppProvider } from '@/app/app-provider';
import { knowledgeBaseLang } from '@/app/(default)/knowledge-base/lang';


export const AddKbsModal = ({ isOpen, setIsOpen, getKbsList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, getKbsList: () => void }) => {
    const { language } = useAppProvider();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: false,
        description: false,
    });

    const handleAddEntry = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Validation logic
        const newErrors = {
            name: !formData.name.trim(),
            description: !formData.description.trim(),
        };
        setErrors(newErrors);

        if (newErrors.name || newErrors.description) {
            message.error(knowledgeBaseLang[language].pleaseFillInAllFields);
            setLoading(false);
            return;
        }

        try {
            const res = await createKnowledgeBase(formData);
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(knowledgeBaseLang[language].addKnowledgeBaseEntrySuccess);
                getKbsList();
            } else {
                message.error(res.status_message || knowledgeBaseLang[language].addKnowledgeBaseEntryFailed);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{knowledgeBaseLang[language].addKnowledgeBaseEntry}</div>
        <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center flex-wrap text-right">
                <label className="text-gray-800 dark:text-gray-100 w-24 text-right">{knowledgeBaseLang[language].name}</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`form-input w-full max-w-xs ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="My-Knowledge-Base"
                />
            </div>
            <div className="flex flex-row gap-4 items-center flex-wrap text-right">
                <label className="text-gray-800 dark:text-gray-100 w-24 text-right">{knowledgeBaseLang[language].description}</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`form-input w-full max-w-xs ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="My-Knowledge-Base-description"
                />
            </div>
            <div className="flex justify-end gap-4">
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-100" type="submit" disabled={loading}>{loading ? knowledgeBaseLang[language].creating : knowledgeBaseLang[language].create}</button>
                <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" disabled={loading} onClick={() => setIsOpen(false)}>{knowledgeBaseLang[language].cancel}</button>
            </div>
        </form>
    </ModalAction>;
};

export const DeleteKbsModal = ({ isOpen, setIsOpen, currentEntry, getKbsList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentEntry: any, getKbsList: () => void }) => {
    const { language } = useAppProvider();
    const [loading, setLoading] = useState(false);

    const handleDeleteEntry = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call the service to delete the knowledge base entry
            const res = await deleteKnowledgeBase({ kb_id: currentEntry.id }); // Assuming deleteKbsEntry is defined in your services
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(knowledgeBaseLang[language].deleteKnowledgeBaseEntrySuccess);
                getKbsList();
            } else {
                message.error(res.status_message || knowledgeBaseLang[language].deleteKnowledgeBaseEntryFailed);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{knowledgeBaseLang[language].deleteKnowledgeBase}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{knowledgeBaseLang[language].areYouSureYouWantToDelete} {currentEntry?.name || knowledgeBaseLang[language].thisKnowledgeBase}?</div>
        <form onSubmit={handleDeleteEntry} className="flex justify-end gap-4">
            <button className="btn bg-red-500 text-white" type="submit" disabled={loading}>{loading ? knowledgeBaseLang[language].deleting : knowledgeBaseLang[language].delete}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{knowledgeBaseLang[language].cancel}</button>
        </form>
    </ModalAction>;
};

export const UpdateKbsModal = ({ isOpen, setIsOpen, currentEntry, getKbsList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentEntry: any, getKbsList: () => void }) => {
    const { language } = useAppProvider();
    const [formData, setFormData] = useState({
        name: currentEntry?.name || '',
        description: currentEntry?.description || '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: false,
        description: false,
    });

    useEffect(() => {
        setFormData({
            name: currentEntry?.name || '',
            description: currentEntry?.description || '',
        });
    }, [currentEntry]);

    const handleUpdateEntry = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Validation logic
        const newErrors = {
            name: !formData.name.trim(),
            description: !formData.description.trim(),
        };
        setErrors(newErrors);

        if (newErrors.name || newErrors.description) {
            message.error(knowledgeBaseLang[language].pleaseFillInAllFields);
            setLoading(false);
            return;
        }

        try {
            const res = await updateKnowledgeBase(currentEntry.id, formData);
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(knowledgeBaseLang[language].updateKnowledgeBaseEntrySuccess);
                getKbsList();
            } else {
                message.error(res.status_message || knowledgeBaseLang[language].updateKnowledgeBaseEntryFailed);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{knowledgeBaseLang[language].updateKnowledgeBase}</div>
        <form onSubmit={handleUpdateEntry} className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center flex-wrap text-right">
                <label className="text-gray-800 dark:text-gray-100 w-24 text-right">{knowledgeBaseLang[language].name}</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`form-input w-full max-w-xs ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="My-Knowledge-Base"
                />
            </div>
            <div className="flex flex-row gap-4 items-center flex-wrap text-right">
                <label className="text-gray-800 dark:text-gray-100 w-24 text-right">{knowledgeBaseLang[language].description}</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`form-input w-full max-w-xs ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="My-Knowledge-Base-description"
                />
            </div>
            <div className="flex justify-end gap-4">
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-100" type="submit" disabled={loading}>{loading ? knowledgeBaseLang[language].updating : knowledgeBaseLang[language].update}</button>
                <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" disabled={loading} onClick={() => setIsOpen(false)}>{knowledgeBaseLang[language].cancel}</button>
            </div>
        </form>
    </ModalAction>;
};

const KbsModal = { AddKbsModal, DeleteKbsModal, UpdateKbsModal };

export default KbsModal;