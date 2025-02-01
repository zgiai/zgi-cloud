import { useAppProvider } from "@/app/app-provider";
import ModalAction from "@/components/modal-action";
import { adminDeleteUser, setAdmin, unSetAdmin } from "@/services/admin";
import { message } from "antd";
import { useState } from "react";
import { organizationLang } from "../../lang";



export function DeleteMemberModal({ isOpen, setIsOpen, currentMember, getMemberList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentMember: any, getMemberList: () => void }) {
    
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider()
    const handleDeleteMember = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await adminDeleteUser({ user_id: currentMember?.id });
            if (res?.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].deleteMemberSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].deleteMemberFailed);
            }
        } catch (error) {
            console.error(error);
            message.error(organizationLang[language].deleteMemberFailed);
        } finally {
            setLoading(false);
        }
    }
    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].deleteMember}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].deleteMemberConfirm}</div>
        <form onSubmit={handleDeleteMember} className="flex justify-end gap-4">
            <button className="btn bg-red-500 text-white" type="submit" disabled={loading}>{loading ? organizationLang[language].deleting : organizationLang[language].delete} </button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export function SetAdminModal({ isOpen, setIsOpen, currentMember, getMemberList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentMember: any, getMemberList: () => void }) {
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider()

    const handleSetAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await setAdmin({ user_id: currentMember?.id });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].setAdminSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].setAdminFailed);
            }
        } catch (error) {
            console.error(error);
            message.error(organizationLang[language].setAdminFailed);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].setAdmin}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].setAdminConfirm}</div>
        <form onSubmit={handleSetAdmin} className="flex justify-end gap-4">
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? organizationLang[language].setting : organizationLang[language].setAdmin}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export function UnsetAdminModal({ isOpen, setIsOpen, currentMember, getMemberList }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentMember: any, getMemberList: () => void }) {
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider()

    const handleUnsetAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await unSetAdmin({ user_id: currentMember?.id });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].unsetAdminSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].unsetAdminFailed);
            }
        } catch (error) {
            console.error(error);
            message.error(organizationLang[language].unsetAdminFailed);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].unsetAdmin}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].unsetAdminConfirm}</div>
        <form onSubmit={handleUnsetAdmin} className="flex justify-end gap-4">
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? organizationLang[language].unsetting : organizationLang[language].unsetAdmin}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}
