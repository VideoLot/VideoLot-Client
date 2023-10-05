import { getRootPanelByPath } from '@/utils/panel'
import { ClientRootPanel } from './components/panels/client-root-panel'
import ServerRootPanel from './components/panels/server-root-panel'
import { Panel } from '@videolot/videolot-prisma';

export default async function Home() {
  const rootPanel = await getRootPanelByPath('/');
  return (
    <div className="flex flex-col justify-between p-4 md:p-10">
      {
        rootPanel?
        <ClientRootPanel panel={rootPanel}>
          <ServerRootPanel panel={rootPanel}></ServerRootPanel>
        </ClientRootPanel>
        :
        <h1>ERROR</h1>
      }
      
    </div>
  )
}
