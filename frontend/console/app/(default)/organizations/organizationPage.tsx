"use client"

import { useEffect, useState } from "react"
import { getOrganization, getOrgPermission } from "@/services/organization"
import { message } from "antd"
import Link from "next/link"
import { motion } from "framer"
import { useAppProvider } from "@/app/app-provider"
import { organizationLang } from "@/app/(default)/organizations/lang"

export default function OrganizationPage() {
    const [organizationList, setOrganizationList] = useState<any[]>([])
    const { userInfo, language } = useAppProvider()
    const [userType, setUserType] = useState<number>(-1)

    useEffect(() => {
        getOrganizationList()
        setUserType(userInfo?.user_type)
    }, [userInfo])

    const getOrganizationList = async () => {
        try {
            const res = await getOrganization()
            if (res?.status_code === 200) {
                setOrganizationList(res?.data?.organizations || [])
            } else {
                message.error(res?.status_message || "Failed to fetch organizations")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col px-4 py-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between p-4 border-b border-gray-200 dark:border-gray-700/60 items-center flex-wrap gap-4">
            <div className="flex-1">
                <span className="text-2xl text-gray-800 dark:text-gray-100 font-bold">{organizationLang[language].title}</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
                {(userInfo?.user_type === 1 || userInfo?.user_type === 2) && <>
                    <Link href={`/organizations/members`} className="text-gray-500/80 dark:text-gray-400/80 hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-700 p-1 rounded-md">
                        <svg className="fill-current" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M883.824 603.006h-46.922c-7.612 27.613-18.546 53.772-32.526 78.063l43.357 43.322c27.752 27.751 27.752 72.735 0 100.485l-25.121 25.122c-27.751 27.752-72.735 27.752-100.486 0l-43.634-43.634c-24.187 13.77-50.278 24.535-77.75 32.007v45.502c0 39.241-31.8 71.04-71.04 71.04H494.2c-39.24 0-71.074-31.799-71.074-71.04V838.37c-27.439-7.473-53.53-18.236-77.751-32.007l-43.635 43.634c-27.715 27.752-72.699 27.752-100.45 0l-25.122-25.122c-27.751-27.75-27.751-72.734 0-100.485l43.357-43.322c-13.98-24.29-24.914-50.45-32.56-78.063h-46.887c-39.24 0-71.04-31.8-71.04-71.004v-35.539c0-39.24 31.8-71.04 71.04-71.04h46.332c7.336-27.335 17.856-53.357 31.454-77.508l-41.696-41.663c-27.751-27.749-27.751-72.733 0-100.485l25.122-25.12c27.751-27.754 72.735-27.754 100.45 0l40.866 40.9c25.018-14.569 52.008-25.917 80.521-33.704v-47.717c0-39.242 31.834-71.04 71.074-71.04h35.502c39.24 0 71.04 31.798 71.04 71.04v47.717c28.546 7.786 55.535 19.134 80.52 33.704l40.865-40.9c27.751-27.754 72.735-27.754 100.486 0l25.121 25.12c27.752 27.752 27.752 72.736 0 100.485l-41.696 41.663c13.6 24.152 24.084 50.173 31.454 77.507h46.333c39.24 0 71.038 31.801 71.038 71.041v35.539c-0.002 39.203-31.801 71.004-71.04 71.004z m-371.876-283.05c-107.89 0-195.364 87.475-195.364 195.367 0 107.89 87.474 195.364 195.364 195.364 107.893 0 195.367-87.474 195.367-195.364s-87.473-195.367-195.367-195.367z m0 281.94c-49.03 0-88.824-39.721-88.824-88.788 0-49.068 39.794-88.79 88.824-88.79 49.033 0 88.793 39.72 88.793 88.79 0 49.066-39.76 88.788-88.793 88.788z"></path></svg>
                    </Link>
                    <Link href="/organizations/create" className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                        <svg className="fill-current text-gray-400 shrink-0" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span className="ml-2">{organizationLang[language].createOrganization}</span>
                    </Link>
                </>
                }
            </div>
        </motion.div>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4 p-4">
            {organizationList.filter((organization) => organization?.is_active).map((organization, index) => (
                <motion.div
                    key={organization?.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * (index + 1) }}
                >
                    <OrganizationCard organization={organization} userType={userType} language={language} />
                </motion.div>
            ))}
            {
                organizationList.filter((organization) => !organization?.is_active).length > 0 && <>
                    <span className="text-lg text-gray-800 dark:text-gray-100 font-bold">{organizationLang[language].disabled}</span>
                    {organizationList.filter((organization) => !organization?.is_active).map((organization, index) => (
                        <motion.div
                            key={organization?.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 * (index + 1) }}
                        >
                            <OrganizationCard organization={organization} userType={userType} language={language} />
                        </motion.div>
                    ))}
                </>
            }
        </motion.div>
    </motion.div>
}

function OrganizationCard({ organization, userType, language }: { organization: any, userType: number, language: "en" | "zh" }) {
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    useEffect(() => {
        console.log(userType)
        if (userType === -1) {
            setIsAdmin(false)
        } else if (userType === 1 || userType === 2) {
            setIsAdmin(true)
        } else {
            getOrgMemberInfo()
        }
    }, [userType])

    const getOrgMemberInfo = async () => {
        try {
            const res = await getOrgPermission({ organization_id: organization?.id })
            if (res?.status_code === 200) {
                setIsAdmin(res?.data?.is_admin || false)
            } else {
                message.error(res?.status_message || "Failed to fetch organization member info")
            }
        } catch (err) {
            console.log(err)
        }
    }
    return <motion.div 
        className="flex flex-col gap-4 p-4 border border-gray-200 dark:border-gray-700/60 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        transition={{ type: "spring", stiffness: 300 }}
    >
        <motion.div 
            className="flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-row gap-2 items-center justify-between flex-wrap">
                <motion.span 
                    className="text-lg text-gray-800 dark:text-gray-100 font-bold"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {organization.name}
                </motion.span>
                <motion.div 
                    className="flex flex-row gap-2 items-center"
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link href={`/organization/${organization?.id}/settings`} className="text-gray-500/80 dark:text-gray-400/80 hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-700 p-1 rounded-md">
                        <svg className="fill-current" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M883.824 603.006h-46.922c-7.612 27.613-18.546 53.772-32.526 78.063l43.357 43.322c27.752 27.751 27.752 72.735 0 100.485l-25.121 25.122c-27.751 27.752-72.735 27.752-100.486 0l-43.634-43.634c-24.187 13.77-50.278 24.535-77.75 32.007v45.502c0 39.241-31.8 71.04-71.04 71.04H494.2c-39.24 0-71.074-31.799-71.074-71.04V838.37c-27.439-7.473-53.53-18.236-77.751-32.007l-43.635 43.634c-27.715 27.752-72.699 27.752-100.45 0l-25.122-25.122c-27.751-27.75-27.751-72.734 0-100.485l43.357-43.322c-13.98-24.29-24.914-50.45-32.56-78.063h-46.887c-39.24 0-71.04-31.8-71.04-71.004v-35.539c0-39.24 31.8-71.04 71.04-71.04h46.332c7.336-27.335 17.856-53.357 31.454-77.508l-41.696-41.663c-27.751-27.749-27.751-72.733 0-100.485l25.122-25.12c27.751-27.754 72.735-27.754 100.45 0l40.866 40.9c25.018-14.569 52.008-25.917 80.521-33.704v-47.717c0-39.242 31.834-71.04 71.074-71.04h35.502c39.24 0 71.04 31.798 71.04 71.04v47.717c28.546 7.786 55.535 19.134 80.52 33.704l40.865-40.9c27.751-27.754 72.735-27.754 100.486 0l25.121 25.12c27.752 27.752 27.752 72.736 0 100.485l-41.696 41.663c13.6 24.152 24.084 50.173 31.454 77.507h46.333c39.24 0 71.038 31.801 71.038 71.041v35.539c-0.002 39.203-31.801 71.004-71.04 71.004z m-371.876-283.05c-107.89 0-195.364 87.475-195.364 195.367 0 107.89 87.474 195.364 195.364 195.364 107.893 0 195.367-87.474 195.367-195.364s-87.473-195.367-195.367-195.367z m0 281.94c-49.03 0-88.824-39.721-88.824-88.788 0-49.068 39.794-88.79 88.824-88.79 49.033 0 88.793 39.72 88.793 88.79 0 49.066-39.76 88.788-88.793 88.788z"></path></svg>
                    </Link>
                    {isAdmin && <Link href={`/organization/${organization?.id}/settings/create`} className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                        <svg className="fill-current text-gray-400 shrink-0" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span className="ml-2">{organizationLang[language].newProject}</span>
                    </Link>}
                </motion.div>
            </div>
            <motion.div 
                className="grid 2xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                {organization?.projects?.map((project: any, index: number) => (
                    <motion.div
                        key={"project-" + project?.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                    >
                        <ProjectCard project={project} language={language} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    </motion.div>
}

function ProjectCard({ project, language }: { project: any, language: "en" | "zh" }) {
    return <motion.div 
        className="flex flex-col gap-2 flex-wrap p-4 border border-gray-200 dark:border-gray-700/60 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        // whileHover={{ 
        //     scale: 1.03,
        //     boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
        // }}
        transition={{ 
            type: "spring",
            stiffness: 300
        }}
    >
        <motion.div 
            className="flex flex-row gap-2 items-center justify-between flex-wrap mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.span 
                className="text-lg text-gray-800 dark:text-gray-100 font-bold"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                {project.name}
            </motion.span>
        </motion.div>
        <motion.div 
            className="flex flex-row gap-2 items-center justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <Link href={`/project/${project?.id}/settings`} className="text-gray-500/80 dark:text-gray-400/80 hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-700 p-1 rounded-md">
                <svg className="fill-current" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M883.824 603.006h-46.922c-7.612 27.613-18.546 53.772-32.526 78.063l43.357 43.322c27.752 27.751 27.752 72.735 0 100.485l-25.121 25.122c-27.751 27.752-72.735 27.752-100.486 0l-43.634-43.634c-24.187 13.77-50.278 24.535-77.75 32.007v45.502c0 39.241-31.8 71.04-71.04 71.04H494.2c-39.24 0-71.074-31.799-71.074-71.04V838.37c-27.439-7.473-53.53-18.236-77.751-32.007l-43.635 43.634c-27.715 27.752-72.699 27.752-100.45 0l-25.122-25.122c-27.751-27.75-27.751-72.734 0-100.485l43.357-43.322c-13.98-24.29-24.914-50.45-32.56-78.063h-46.887c-39.24 0-71.04-31.8-71.04-71.004v-35.539c0-39.24 31.8-71.04 71.04-71.04h46.332c7.336-27.335 17.856-53.357 31.454-77.508l-41.696-41.663c-27.751-27.749-27.751-72.733 0-100.485l25.122-25.12c27.751-27.754 72.735-27.754 100.45 0l40.866 40.9c25.018-14.569 52.008-25.917 80.521-33.704v-47.717c0-39.242 31.834-71.04 71.074-71.04h35.502c39.24 0 71.04 31.798 71.04 71.04v47.717c28.546 7.786 55.535 19.134 80.52 33.704l40.865-40.9c27.751-27.754 72.735-27.754 100.486 0l25.121 25.12c27.752 27.752 27.752 72.736 0 100.485l-41.696 41.663c13.6 24.152 24.084 50.173 31.454 77.507h46.333c39.24 0 71.038 31.801 71.038 71.041v35.539c-0.002 39.203-31.801 71.004-71.04 71.004z m-371.876-283.05c-107.89 0-195.364 87.475-195.364 195.367 0 107.89 87.474 195.364 195.364 195.364 107.893 0 195.367-87.474 195.367-195.364s-87.473-195.367-195.367-195.367z m0 281.94c-49.03 0-88.824-39.721-88.824-88.788 0-49.068 39.794-88.79 88.824-88.79 49.033 0 88.793 39.72 88.793 88.79 0 49.066-39.76 88.788-88.793 88.788z"></path></svg>
            </Link>
            <Link href={`/project/${project?.id}/apikey`} className="btn bg-gray-600 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">{organizationLang[language].goToProject}</Link>
        </motion.div>
    </motion.div>
}
