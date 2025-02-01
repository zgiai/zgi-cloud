'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppProvider } from '@/app/app-provider'
import { useSelectedLayoutSegments } from 'next/navigation'
import { Transition } from '@headlessui/react'
import { getBreakpoint } from '../utils/utils'
import SidebarLinkGroup from './sidebar-link-group'
import SidebarLink from './sidebar-link'
import Logo from './logo'

const sidebarLang = {
  en: {
    more: "More",
    authentication: "Authentication",
    signIn: "Sign in",
    signUp: "Sign up",
  },
  zh: {
    more: "更多",
    authentication: "登录注册",
    signIn: "登录",
    signUp: "注册",
  },
}

export default function Sidebar({
  variant = 'default',
  links = []
}: {
  variant?: 'default' | 'v2'
  links?: any[]
}) {
  const sidebar = useRef<HTMLDivElement>(null)
  const { sidebarOpen, setSidebarOpen,language } = useAppProvider()
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false)
  const segments = useSelectedLayoutSegments()
  const [breakpoint, setBreakpoint] = useState<string | undefined>(getBreakpoint())
  const expandOnly = !sidebarExpanded && (breakpoint === 'lg' || breakpoint === 'xl')
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!sidebar.current) return
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // useEffect(() => {
  //   console.log(segments)
  // }, [segments])

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  const handleBreakpoint = () => {
    setBreakpoint(getBreakpoint())
  }

  useEffect(() => {
    window.addEventListener('resize', handleBreakpoint)
    return () => {
      window.removeEventListener('resize', handleBreakpoint)
    }
  }, [breakpoint])

  const bottomLinks = {
    type: 'group',
    title: sidebarLang[language].more,
    children: [
      {
        type: 'group',
        title: sidebarLang[language].authentication,
        path: 'authentication',
        icon: (
          <svg className={`shrink-0 fill-current`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path d="M11.442 4.576a1 1 0 1 0-1.634-1.152L4.22 11.35 1.773 8.366A1 1 0 1 0 .227 9.634l3.281 4a1 1 0 0 0 1.59-.058l6.344-9ZM15.817 4.576a1 1 0 1 0-1.634-1.152l-5.609 7.957a1 1 0 0 0-1.347 1.453l.656.8a1 1 0 0 0 1.59-.058l6.344-9Z" />
          </svg>
        ),
        children: [
          { type: 'sublink', title: sidebarLang[language].signIn, href: '/signin' },
          { type: 'sublink', title: sidebarLang[language].signUp, href: '/signup' },
          // { type: 'sublink', title: 'Reset Password', href: '/reset-password' },
        ],
      },
    ],
  }

  return (
    <div className={`min-w-fit ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
      {/* Sidebar backdrop (mobile only) */}
      <Transition
        as="div"
        className="fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto"
        show={sidebarOpen}
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        unmount={false}
        as="div"
        id="sidebar"
        ref={sidebar}
        className={`flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-sm'}`}
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Logo />
        </div>
        <div className="space-y-8 flex-1 justify-between flex flex-col">
          <div className="flex-1 gap-4 flex flex-col">
            {links.map((group, index) => (
              <div className="flex flex-col" key={index}>
                <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
                  <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                    •••
                  </span>
                  <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">{group.title}</span>
                </h3>
                <LinksItem key={index} group={group} segments={segments} expandOnly={expandOnly} setSidebarExpanded={setSidebarExpanded} />
              </div>
            ))}
          </div>
          <div>
            <LinksItem group={bottomLinks} segments={segments} expandOnly={expandOnly} setSidebarExpanded={setSidebarExpanded} />
          </div>
        </div>
        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  )
}

function LinksItem({ group, segments, expandOnly, setSidebarExpanded }: { group: any, segments: any, expandOnly: boolean, setSidebarExpanded: any }) {
  return <div>
    <ul className="mt-3">
      {group.children.map((link: any, linkIndex: any) => link.type === 'link' ? (
        <li key={linkIndex} className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${segments.includes(link.path.toLowerCase()) && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}>
          <SidebarLink href={link?.href || '#0'}>
            <div className="flex items-center">
              <span className={`${segments.includes(link.path.toLowerCase()) ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}>
                {link.icon}
              </span>
              <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">{link.title}</span>
            </div>
          </SidebarLink>
        </li>) : (
        <SidebarLinkGroup key={linkIndex} open={segments.includes(link.path.toLowerCase())}>
          {(handleClick, open) => (
            <>
              <a
                href={link?.href || '#0'}
                className={`block text-gray-800 dark:text-gray-100 truncate transition ${segments.includes(link.path.toLowerCase()) ? '' : 'hover:text-gray-900 dark:hover:text-white'}`}
                onClick={(e) => {
                  e.preventDefault();
                  expandOnly ? setSidebarExpanded(true) : handleClick();
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`${segments.includes(link.path.toLowerCase()) ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}>
                      {link.icon}
                    </span>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      {link.title}
                    </span>
                  </div>
                  {link.children && (
                    <div className="flex shrink-0 ml-2">
                      <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </div>
                  )}
                </div>
              </a>
              {link.children && (
                <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul className={`pl-8 mt-1 ${!open && 'hidden'}`}>
                    {link.children.map((sublink: any, sublinkIndex: any) => (
                      <li key={sublinkIndex} className="mb-1 last:mb-0">
                        <SidebarLink href={sublink.href}>
                          <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            {sublink.title}
                          </span>
                        </SidebarLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </SidebarLinkGroup>
      ))}
    </ul>
  </div>
}
