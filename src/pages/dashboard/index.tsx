import Dashboard from 'src/libs/dashboard/containers'

const DashboardPage = () => {
  return <Dashboard />
}

DashboardPage.acl = {
  subject: 'DASHBOARD',
  action: 'VIEW'
}

export default DashboardPage
