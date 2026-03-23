import {useConfigStore} from "../store/useConfigStore";
import {TechRadar} from "./TechRadar.tsx";
import {useMemo} from "react";
import {getRadarData} from "../utils/config.ts";

function App() {
    const {domain, expertise} = useConfigStore();
    const currentConfig = useMemo(() => {
        return getRadarData(domain, expertise);
    }, [domain, expertise])

    return (
        <div className="app" style={{height: "100vh"}}>
            {/*<Header configType={configType} setConfigType={setConfigType} />*/}
            <div className="center"
                 style={{
                     padding: 24,
                     // height: "calc(100vh - 40px)", //for Header
                     height: "100vh",
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: "center"
                 }}>
                <TechRadar key={domain + ' ' + expertise} config={currentConfig}/>
            </div>
        </div>
    )
}

export default App