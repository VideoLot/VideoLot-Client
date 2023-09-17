
import ServerPanel from '@/app/components/panels/server-panel'
import RootPanel from './components/panels/root-panel'

export default function Home() {
  return (
    <div className="flex flex-col justify-between p-4 md:p-10">
      <RootPanel path='/'></RootPanel>
    </div>
  )
}
