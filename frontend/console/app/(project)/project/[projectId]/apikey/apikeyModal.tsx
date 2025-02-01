import ModalAction from "@/components/modal-action";
import { createApiKey, deleteApiKey, updateApiKey, enableApiKey, disableApiKey } from "@/services/apikey";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useAppProvider } from "@/app/app-provider";
import { projectLang } from "@/app/(project)/project/lang";

export function CreateApiKeyModal({ isOpen, setIsOpen, projectId, getApiKeyList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, projectId: string, getApiKeyList: () => void }) {
    const [apiKeyName, setApiKeyName] = useState("");
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createApiKey({ name: apiKeyName }, { project_id: projectId });
            if (res.status_code === 200) {
                setIsOpen(false);
                setApiKeyName("");
                message.success(projectLang[language].createApiKeySuccess);
                getApiKeyList();
            } else {
                message.error(res.status_message || projectLang[language].createApiKeyFailed);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{projectLang[language].createApiKey}</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-gray-800 dark:text-gray-100">{projectLang[language].apiKeyName}</label>
                <input id="name" className="form-input w-full" placeholder="my-api-key" type="text" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value.trim())} />
            </div>
            <div className="flex justify-end gap-4">
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? projectLang[language].creating : projectLang[language].create}</button>
                <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{projectLang[language].cancel}</button>
            </div>
        </form>
    </ModalAction>
}

export function DeleteApiKeyModal({ isOpen, setIsOpen, currentApiKey, getApiKeyList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentApiKey: any, getApiKeyList: () => void }) {
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();
    const handleDeleteApiKey = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await deleteApiKey({ api_key_uuid: currentApiKey?.uuid });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(projectLang[language].deleteApiKeySuccess);
                getApiKeyList();
            } else {
                message.error(res.status_message || projectLang[language].deleteApiKeyFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{projectLang[language].deleteApiKey}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{projectLang[language].deleteApiKeyConfirmation}</div>
        <form onSubmit={handleDeleteApiKey} className="flex justify-end gap-4">
            <button className="btn bg-red-500 text-white" type="submit" disabled={loading}>{loading ? projectLang[language].deleting : projectLang[language].delete} </button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{projectLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export function UpdateApiKeyModal({ isOpen, setIsOpen, currentApiKey, getApiKeyList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentApiKey: any, getApiKeyList: () => void }) {
    const [apiKeyName, setApiKeyName] = useState(currentApiKey?.name);
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();

    useEffect(() => {
        setApiKeyName(currentApiKey?.name);
    }, [currentApiKey]);

    const handleUpdateApiKey = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateApiKey({ name: apiKeyName }, { api_key_uuid: currentApiKey?.uuid });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(projectLang[language].updateApiKeySuccess);
                getApiKeyList();
            } else {
                message.error(res.status_message || projectLang[language].updateApiKeyFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{projectLang[language].updateApiKey}</div>
        <form onSubmit={handleUpdateApiKey} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-gray-800 dark:text-gray-100">{projectLang[language].apiKeyName}</label>
                <input id="name" className="form-input w-full" placeholder="my-api-key" type="text" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value.trim())} />
            </div>
            <div className="flex justify-end gap-4">
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? projectLang[language].updating : projectLang[language].update}</button>
                <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{projectLang[language].cancel}</button>
            </div>
        </form>
    </ModalAction>
}

export const DisableApiKeyModal = ({ isOpen, setIsOpen, currentApiKey, getApiKeyList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentApiKey: any, getApiKeyList: () => void }) => {

    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();
    const handleDisableApiKey = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await disableApiKey({ api_key_uuid: currentApiKey?.uuid });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(projectLang[language].disableApiKeySuccess);
                getApiKeyList();
            } else {
                message.error(res.status_message || projectLang[language].disableApiKeyFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{projectLang[language].disableApiKey}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{projectLang[language].disableApiKeyConfirmation}</div>
        <form className="flex justify-end gap-4" onSubmit={handleDisableApiKey}>
            <button className="btn bg-red-500 text-white hover:bg-red-600" type="submit" disabled={loading} >{loading ? projectLang[language].disabling : projectLang[language].disable}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)} >{projectLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export const EnableApiKeyModal = ({ isOpen, setIsOpen, currentApiKey, getApiKeyList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentApiKey: any, getApiKeyList: () => void }) => {
    const { language } = useAppProvider();
    const [loading, setLoading] = useState(false);
    const handleEnableApiKey = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await enableApiKey({ api_key_uuid: currentApiKey?.uuid });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(projectLang[language].enableApiKeySuccess);
                getApiKeyList();
            } else {
                message.error(res.status_message || projectLang[language].enableApiKeyFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{projectLang[language].enableApiKey}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{projectLang[language].enableApiKeyConfirmation}</div>
        <form className="flex justify-end gap-4" onSubmit={handleEnableApiKey}>
            <button className="btn bg-green-500 text-white hover:bg-green-600" type="submit" disabled={loading} >{loading ? projectLang[language].enabling : projectLang[language].enable}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)} >{projectLang[language].cancel}</button>
        </form>
    </ModalAction>
}