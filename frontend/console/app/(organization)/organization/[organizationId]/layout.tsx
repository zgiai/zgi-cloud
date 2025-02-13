'use client'

import Sidebar from '@/components/ui/sidebar'
import Header from '@/components/ui/header'
import { useParams } from 'next/navigation'
import { useAppProvider } from '@/app/app-provider'
import { organizationLang } from '@/app/(organization)/organization/lang'

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const organizationId = params?.organizationId || ''
  const { language } = useAppProvider()

  const organizationLinks = [
    {
      type: 'groups',
      title: organizationLang[language].organization,
      children: [
        {
          type: 'link',
          title: organizationLang[language].organizations,
          path: 'organizations',
          icon: (
            <svg className={`shrink-0 fill-current`} viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7526" width="16" height="16">
              <path d="M338.163055 376.734778a211.351909 105.675955 0 1 0 422.703818 0 211.351909 105.675955 0 1 0-422.703818 0Z" fill="currentColor" fillOpacity={0.5}></path>
              <path d="M831.669763 566.599243a216.107327 216.107327 0 0 0-30.293774 2.465772l-73.973168-109.022359 5.107671-4.403165 4.050912-3.522532a267.712418 267.712418 0 0 0 0-375.325765 267.712418 267.712418 0 0 0-375.325766 0 267.536292 267.536292 0 0 0 0 375.149638A207.829377 207.829377 0 0 0 389.239766 475.541796l-66.399725 111.312005A228.964568 228.964568 0 0 0 228.964568 566.599243a231.254214 231.254214 0 0 0-228.964568 228.964568 226.674923 226.674923 0 0 0 67.808738 160.979705A228.964568 228.964568 0 0 0 228.964568 1024a233.54386 233.54386 0 0 0 159.922945-67.808738 225.26591 225.26591 0 0 0 0-321.783281c-2.113519-2.113519-4.579291-4.579291-7.22119-6.868937l70.450636-116.948057a271.587203 271.587203 0 0 0 96.869625 17.612659 264.189886 264.189886 0 0 0 120.118335-28.884761l63.757826 94.0516a188.807706 188.807706 0 0 0-92.818713 165.382869 193.73925 193.73925 0 1 0 385.717234 0 190.745098 190.745098 0 0 0-194.091503-192.154111z m-441.725491 228.964568a160.979704 160.979704 0 0 1-47.201926 112.368766A172.427933 172.427933 0 0 1 228.964568 957.600275a158.513932 158.513932 0 0 1-113.425524-48.258686 157.633299 157.633299 0 0 1 0-227.027176A160.099071 160.099071 0 0 1 228.964568 634.055728a155.695906 155.695906 0 0 1 113.073272 48.787065 160.275198 160.275198 0 0 1 47.906432 113.601651z m234.424493-348.906776a200.96044 200.96044 0 0 1-74.853801 14.794633 211.351909 211.351909 0 0 1-76.791194-14.794633A191.801858 191.801858 0 0 1 408.613691 405.091159a205.715858 205.715858 0 0 1-42.622635-63.581699 208.533884 208.533884 0 0 1 0-153.406261 188.983832 188.983832 0 0 1 105.675955-105.675954 211.351909 211.351909 0 0 1 76.615067-14.618507 215.226694 215.226694 0 0 1 76.791193 14.618507A192.330237 192.330237 0 0 1 689.71173 123.288614a189.159959 189.159959 0 0 1 41.918129 64.110079 208.71001 208.71001 0 0 1 14.794634 76.791193 211.351909 211.351909 0 0 1-14.794634 76.791194 187.574819 187.574819 0 0 1-40.861369 62.877193 221.391125 221.391125 0 0 1-66.399725 42.798762z m296.949432 401.92088A129.100791 129.100791 0 0 1 880.632955 875.349157a131.74269 131.74269 0 0 1-48.258686 9.686963 127.515652 127.515652 0 0 1-48.258686-9.686963 125.754386 125.754386 0 0 1-77.671827-115.891297A123.288614 123.288614 0 0 1 832.198142 634.055728a126.987272 126.987272 0 0 1 90.352942 36.282077 125.402133 125.402133 0 0 1 36.282077 89.120055 123.288614 123.288614 0 0 1-37.514964 89.120055z" fill="currentColor"></path>
            </svg>
          ),
          href: '/organizations',
        },

      ],
    },
    {
      type: 'groups',
      title: organizationLang[language].projects,
      children: [
        {
          type: 'link',
          title: organizationLang[language].projects,
          path: 'projects',
          icon: <svg className={`shrink-0 fill-current`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path d="M6.753 2.659a1 1 0 0 0-1.506-1.317L2.451 4.537l-.744-.744A1 1 0 1 0 .293 5.207l1.5 1.5a1 1 0 0 0 1.46-.048l3.5-4ZM6.753 10.659a1 1 0 1 0-1.506-1.317l-2.796 3.195-.744-.744a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.46-.049l3.5-4ZM8 4.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 11.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" />
          </svg>,
          href: `/organization/${organizationId}/projects`,
        },
        {
          type: 'link',
          title: organizationLang[language].settings,
          path: 'settings',
          icon: <svg className={`shrink-0 fill-current`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path d="M10.5 1a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2h-1.145a3.502 3.502 0 0 1-6.71 0H1a1 1 0 0 1 0-2h6.145A3.502 3.502 0 0 1 10.5 1ZM9 4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM5.5 9a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2H8.855a3.502 3.502 0 0 1-6.71 0H1a1 1 0 1 1 0-2h1.145A3.502 3.502 0 0 1 5.5 9ZM4 12.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fillRule="evenodd" />
          </svg>,
          href: `/organization/${organizationId}/settings`,
        }
      ]
    }
  ];

  return (
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Sidebar */}
      <Sidebar links={organizationLinks} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header />

        <main className="grow [&>*:first-child]:scroll-mt-16">
          {children}
        </main>

      </div>

    </div>
  )
}
