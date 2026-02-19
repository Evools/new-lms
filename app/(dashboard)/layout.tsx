import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-gray-800 text-white hidden md:block">
        <div className="p-4 font-bold text-xl">LMS System</div>
        <nav className="mt-4">
             <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Dashboard</div>
             {/* Role based links will go here */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center px-6 justify-between">
            <div className="font-medium">Welcome, {session.user.name} ({session.user.role})</div>
            <div>
               {/* Logout button placeholder */}
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
