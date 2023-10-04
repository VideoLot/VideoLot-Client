import { ClientRootPanel } from './components/panels/client-root-panel'
import ServerRootPanel from './components/panels/server-root-panel'

export default function Home() {
  return (
    <div className="flex flex-col justify-between p-4 md:p-10">
      <ClientRootPanel>
        <ServerRootPanel path='/'></ServerRootPanel>
      </ClientRootPanel>
    </div>
  )
}
