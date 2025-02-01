"use client"

import { useState, useEffect } from "react"
import { getProjectDetail } from "@/services/project"
import { message } from "antd"
import { useParams } from "next/navigation"
import { DeleteProjectModal, EditProjectModal } from "./settingsModal"
import { useAppProvider } from "@/app/app-provider";
import { projectLang } from "@/app/(project)/project/lang";

export default function SettingsPage() {
    const params = useParams()
    const projectId = params.projectId as string || ""
    const [isAdmin, setIsAdmin] = useState(false);
    const [projectInfo, setProjectInfo] = useState<any>({});
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
    const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);

    const { userInfo, language } = useAppProvider()

    const getOrganizationInfo = async () => {
        try {
            const res = await getProjectDetail({ project_id: projectId })
            if (res.status_code === 200) {
                setProjectInfo(res?.data);
            } else {
                message.error(res?.status_message || 'Failed to fetch project info');
            }
        } catch (error) {
            console.error('Error fetching project info:', error);
        };
    }

    const getUserRole = async () => {
        if (userInfo?.user_type === 1 || userInfo?.user_type === 2) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }

    useEffect(() => {
        getOrganizationInfo();
        getUserRole();
    }, [userInfo])

    return <>
        <DeleteProjectModal isOpen={isDeleteProjectModalOpen} setIsOpen={setIsDeleteProjectModalOpen} projectId={projectId} />
        <EditProjectModal isOpen={editProjectModalOpen} setIsOpen={setEditProjectModalOpen} projuctId={projectId} projectInfo={projectInfo} isAdmin={isAdmin} />
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{projectLang[language].projectSettings}</h1>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px"></div>
                <div className="flex flex-col px-4 py-4 w-full max-w-[96rem] mx-auto gap-4">
                    <div className="flex justify-between py-4 border-b border-gray-200 dark:border-gray-700/60 items-center flex-wrap gap-4">
                        <div className="flex-1">
                            <span className="text-2xl text-gray-800 dark:text-gray-100 font-bold">{projectLang[language].projectSettings}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-700/60 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex flex-row gap-2 border-b border-gray-200 dark:border-gray-700/60">
                            <div className="flex flex-col gap-2 flex-1 pb-4">
                                <div>
                                    <span className="text-lg text-gray-800 dark:text-gray-100 font-bold">{projectInfo?.name || projectLang[language].projectName}</span>
                                </div>
                                <div>
                                    <span className="text-lg text-gray-800 dark:text-gray-100">{projectInfo?.description || projectLang[language].noDescription}</span>
                                </div>
                            </div>
                            <div>
                                {isAdmin && <button
                                    className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                    onClick={() => {
                                        setEditProjectModalOpen(true);
                                    }}
                                >
                                    {projectLang[language].edit}
                                </button>}
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            {isAdmin && <button
                                className={`btn text-white bg-red-500 hover:bg-red-600`}
                                onClick={() => {
                                    setIsDeleteProjectModalOpen(true);
                                }}
                            >
                                {projectLang[language].deleteProject}
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}