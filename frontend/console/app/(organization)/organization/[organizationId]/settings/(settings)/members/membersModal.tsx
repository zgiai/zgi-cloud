import ModalAction from "@/components/modal-action";
import { removeOrgMember, unsetOrgAdmin, setOrgAdmin, searchUserByEmail, addOrgMember, inviteOrgMember } from "@/services/organization";
import { message } from "antd";
import { useState, useEffect } from "react";
import { organizationLang } from "@/app/(organization)/organization/lang";
import { useAppProvider } from "@/app/app-provider";

export function DeleteMemberModal({ isOpen, setIsOpen, currentMember, getMemberList, orgId }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentMember: any, getMemberList: () => void, orgId: string }) {
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();     

    const handleDeleteMember = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await removeOrgMember({ user_ids: [currentMember?.user_id], organization_id: orgId });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].deleteMemberSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].deleteMemberFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].deleteMember}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].deleteMemberConfirmation}</div>
        <form onSubmit={handleDeleteMember} className="flex justify-end gap-4">
            <button className="btn bg-red-500 text-white" type="submit" disabled={loading}>{loading ? organizationLang[language].deleting : organizationLang[language].delete} </button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export function SetAdminModal({ isOpen, setIsOpen, currentMember, getMemberList, orgId }: { isOpen: boolean, setIsOpen: (value: boolean) => void, currentMember: any, getMemberList: () => void, orgId: string }) {
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();
    const handleSetAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await setOrgAdmin({ organization_id: orgId, user_ids: [currentMember?.user_id] });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].setOrganizationAdminSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].setOrganizationAdminFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].setOrganizationAdmin}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].setOrganizationAdminConfirmation}</div>
        <form onSubmit={handleSetAdmin} className="flex justify-end gap-4">
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? organizationLang[language].setting : organizationLang[language].setAdmin}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export function UnsetAdminModal({
    isOpen, setIsOpen, currentMember, getMemberList, orgId
}: {
    isOpen: boolean, setIsOpen: (value: boolean) => void, currentMember: any, getMemberList: () => void, orgId: string
}) {
    const [loading, setLoading] = useState(false);
    const { language } = useAppProvider();

    const handleUnsetAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await unsetOrgAdmin({ organization_id: orgId, user_ids: [currentMember?.user_id] });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].unsetAdminSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].unsetAdminFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].unsetOrganizationAdmin}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].unsetAdminConfirmation}</div>
        <form onSubmit={handleUnsetAdmin} className="flex justify-end gap-4">
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? organizationLang[language].unsetting : organizationLang[language].unsetAdmin}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export const AddMemberModal = ({ isOpen, setIsOpen, getMemberList, orgId }: { isOpen: boolean, setIsOpen: (value: boolean) => void, getMemberList: () => void, orgId: string }) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchMember, setSearchMember] = useState<any>(null)
    const { language } = useAppProvider();

    const handleSearchUserByEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchLoading(true);
        try {
            const res = await searchUserByEmail({ email: email, organization_id: orgId });
            if (res.status_code === 200) {
                console.log(res.data);
                setSearchMember(res.data);
            } else {
                message.error(res.status_message || organizationLang[language].searchUserFailed);
                setSearchMember(null);
            }
        } catch (error) {
            console.error(error);
            setSearchMember(null);
            setEmail('');
            setSearchLoading(false);
        } finally {
            setSearchLoading(false);
        }
    }

    const handleAddMember = async () => {
        setLoading(true);
        try {
            const res = await addOrgMember({ user_ids: [searchMember?.user_id], organization_id: orgId });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].addMemberSuccess);
                getMemberList();
            } else {
                message.error(res.status_message || organizationLang[language].addMemberFailed);
            }
        } catch (error) {
            console.error(error);
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].addMember}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].addMemberConfirmation}</div>
        <form onSubmit={handleSearchUserByEmail} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row gap-1 md:items-center">
                    <label htmlFor="email" className="text-gray-800 dark:text-gray-100">{organizationLang[language].email}</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder={organizationLang[language].enterEmail} />
                    <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={searchLoading}>{searchLoading ? organizationLang[language].searching : organizationLang[language].search}</button>
                </div>
            </div>
        </form>
        <div className="mt-4">
            {searchMember && <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm flex flex-col gap-2">
                <div>{organizationLang[language].email}: {searchMember?.email}</div>
                <div>{organizationLang[language].username}: {searchMember?.username}</div>
                <div>{organizationLang[language].user_id}: {searchMember?.user_id}</div>
                <button
                    className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                    onClick={() => { handleAddMember() }}
                    disabled={loading}
                >
                    {loading ? organizationLang[language].adding : organizationLang[language].addMember}
                </button>
            </div>}
        </div>
    </ModalAction>
}

export const InviteMemberModal = ({ isOpen, setIsOpen, orgId }: { isOpen: boolean, setIsOpen: (value: boolean) => void, orgId: string }) => {
    useEffect(() => {
        getInviteLink();
        setOrigin(location.origin);
    }, [isOpen]);
    const { language } = useAppProvider();

    const [token, setToken] = useState('');
    const [origin, setOrigin] = useState('');

    const getInviteLink = async () => {
        try {
            const res = await inviteOrgMember({ organization_id: orgId });
            if (res.status_code === 200) {
                // console.log(res.data);
                setToken(res.data.invite_token);
            } else {
                message.error(res.status_message || organizationLang[language].getInviteLinkFailed);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].inviteMember}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-4">{organizationLang[language].inviteMemberByLink}</div>
        <div
            className="text-lg text-blue-400 mb-6 break-all underline cursor-pointer rounded-md p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600"
            onClick={() => {
                navigator.clipboard.writeText(`${origin}/invite?token=${token}`)
                message.success(organizationLang[language].copiedSuccess);
            }}
        >{`${origin}/invite?token=${token}`}</div>
    </ModalAction>
}
