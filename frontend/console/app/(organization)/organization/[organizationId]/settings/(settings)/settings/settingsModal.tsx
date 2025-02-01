"use client";

import { organizationLang } from "@/app/(organization)/organization/lang";
import ModalAction from "@/components/modal-action";
import { deleteOrganization, updateOrganization } from "@/services/organization";
import { message } from "antd";
import { useState, useEffect } from "react";
import { useAppProvider } from "@/app/app-provider";

export const DeleteOrganizationModal = ({
    isOpen, setIsOpen, orgId
}: {
    isOpen: boolean, setIsOpen: (value: boolean) => void, orgId: string
}) => {
    const { language } = useAppProvider()
    const [loading, setLoading] = useState(false);
    const handleDeleteOrg = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await deleteOrganization({ organization_id: orgId });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].deleteOrganizationSuccess);
                location.href = "/organizations";
            } else {
                message.error(res.status_message || organizationLang[language].deleteOrganizationFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].deleteOrganization}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].deleteOrganizationConfirmation}</div>
        <form onSubmit={handleDeleteOrg} className="flex justify-end gap-4">
            <button className="btn bg-red-500 text-white" type="submit" disabled={loading}>{loading ? organizationLang[language].deleting : organizationLang[language].delete} </button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>;
};

export const QuitOrganizationModal = ({
    isOpen, setIsOpen, orgId
}: {
    isOpen: boolean, setIsOpen: (value: boolean) => void, orgId: string
}) => {
    const { language } = useAppProvider()
    const [loading, setLoading] = useState(false);

    const handleQuitOrg = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await deleteOrganization({ organization_id: orgId });
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].quitOrganizationSuccess);
                location.href = "/organizations";
            } else {
                message.error(res.status_message || organizationLang[language].quitOrganizationFailed);
            }
        } catch (error) {
            console.error(error);
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    }
    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].quitOrganization}</div>
        <div className="text-lg text-gray-800 dark:text-gray-100 mb-6">{organizationLang[language].quitOrganizationConfirmation}</div>
        <form className="flex justify-end gap-4" onSubmit={handleQuitOrg}>
            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? organizationLang[language].quitting : organizationLang[language].quit}</button>
            <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
        </form>
    </ModalAction>
}

export const EditOrganizationModal = ({
    isOpen, setIsOpen, orgId, organizationInfo, isAdmin
}: {
    isOpen: boolean, setIsOpen: (value: boolean) => void, orgId: string, organizationInfo: any, isAdmin: boolean
}) => {
    const { language } = useAppProvider()
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: true
    });

    useEffect(() => {
        setFormData({ isActive: organizationInfo?.is_active, name: organizationInfo?.name || "", description: organizationInfo?.description || "" });
    }, [organizationInfo]);

    const handleEditOrg = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateOrganization({ organization_id: orgId }, formData);
            if (res.status_code === 200) {
                setIsOpen(false);
                message.success(organizationLang[language].editOrganizationSuccess);
                location.href = "/organizations";
            } else {
                message.error(res.status_message || organizationLang[language].editOrganizationFailed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return <ModalAction isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="text-lg text-gray-800 dark:text-gray-100 font-bold mb-6">{organizationLang[language].editOrganization}</div>
        <form onSubmit={handleEditOrg} className="flex gap-4 flex-col">
            <div className="flex flex-row gap-4 items-center flex-wrap">
                <label className="text-gray-800 dark:text-gray-100 w-24 text-right">{organizationLang[language].name}</label>
                <input
                    type="text"
                    placeholder="My orgnization"
                    className="form-input w-full max-w-xs"
                    value={formData?.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
                />
            </div>
            <div className="flex flex-row gap-4 items-center flex-wrap text-right">
                <label className="text-gray-800 dark:text-gray-100 w-24">{organizationLang[language].description}</label>
                <input
                    type="text"
                    placeholder="My orgnization"
                    className="form-input w-full max-w-xs"
                    value={formData?.description}
                    onChange={(e) => { setFormData({ ...formData, description: e.target.value }) }}
                />
            </div>
            {isAdmin && <div className="flex flex-row gap-4 items-center flex-wrap text-right">
                <label className="text-gray-800 dark:text-gray-100 w-24">{organizationLang[language].status}</label>
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex items-center">
                        <div className="form-switch">
                            <input type="checkbox" id="switch-1" className="sr-only" checked={formData?.isActive} onChange={() => setFormData({ ...formData, isActive: !formData?.isActive })} />
                            <label className="bg-gray-400 dark:bg-gray-700" htmlFor="switch-1">
                                <span className="bg-white shadow-sm" aria-hidden="true"></span>
                                <span className="sr-only">{organizationLang[language].switchLabel}</span>
                            </label>
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 italic ml-2">{formData?.isActive ? organizationLang[language].active : organizationLang[language].disabled}</div>
                    </div>
                </div>
            </div>}
            <div className="flex flex-row gap-4 items-center justify-end">
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white" type="submit" disabled={loading}>{loading ? organizationLang[language].saving : organizationLang[language].save} </button>
                <button className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-300" type="button" onClick={() => setIsOpen(false)}>{organizationLang[language].cancel}</button>
            </div>
        </form>
    </ModalAction>
}   