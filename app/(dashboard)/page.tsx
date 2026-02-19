import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {/* Stats cards will go here */}
         <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Your Role</h3>
            <p className="text-2xl font-bold">{session?.user?.role}</p>
         </div>
      </div>
    </div>
  )
}
