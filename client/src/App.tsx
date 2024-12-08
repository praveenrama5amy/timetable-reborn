import { useEffect } from "react"
import { Outlet } from "react-router"
import useAuth from "./hooks/useAuth"
import useAppData from "./hooks/useAppData"
import Nav from "./pages/Nav"
import Loading from "./pages/Loading/Loading"

const minLoadingTime = 10

const App = () => {

  const { fetchDepatments, fetchDepatment, loading } = useAppData()
  const [profileSelected] = useAppData().profile
  useAuth()

  useEffect(() => {
    (async () => {
      const now = performance.now()
      loading[1](true)
      await fetchDepatments()
      setTimeout(() => {
        loading[1](false)
      }, minLoadingTime - (performance.now() - now))
    })()
  }, [])
  useEffect(() => {
    (async () => {
      const now = performance.now()
      loading[1](true);
      await fetchDepatment(profileSelected!)
      setTimeout(() => {
        loading[1](false);
      }, minLoadingTime - (performance.now() - now))

    })()
  }, [profileSelected])

  if (loading[0]) return <Loading />

  return (
    <div style={{ height: "100%" }}>
      <Nav />
      <div style={{ height: "100% " }}>
        <Outlet />
      </div>
    </div >
  )
}

export default App