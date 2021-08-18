import * as React from "react"
import {FunctionComponent} from "react"
import {Request, Response} from './FlowView/HttpMessages'
import Connection from './FlowView/Connection'
import Error from "./FlowView/Error"
import Timing from "./FlowView/Timing"
import WebSocket from "./FlowView/WebSocket"

import {selectTab} from '../ducks/ui/flow'
import {useAppDispatch, useAppSelector} from "../ducks";
import {Flow} from "../flow";
import classnames from "classnames";

type TabProps = {
    flow: Flow
}

export const allTabs: { [name: string]: FunctionComponent<TabProps> } = {
    request: Request,
    response: Response,
    error: Error,
    connection: Connection,
    timing: Timing,
    websocket: WebSocket
}

export function tabsForFlow(flow: Flow): string[] {
    const tabs = ['request', 'response', 'websocket', 'error'].filter(k => flow[k])
    tabs.push("connection")
    tabs.push("timing")
    return tabs;
}

export default function FlowView() {
    const dispatch = useAppDispatch(),
        flow = useAppSelector(state => state.flows.byId[state.flows.selected[0]]),
        tabs = tabsForFlow(flow);

    let active = useAppSelector(state => state.ui.flow.tab)
    if (tabs.indexOf(active) < 0) {
        if (active === 'response' && flow.error) {
            active = 'error'
        } else if (active === 'error' && "response" in flow) {
            active = 'response'
        } else {
            active = tabs[0]
        }
    }
    const Tab = allTabs[active];

    return (
        <div className="flow-detail">
            <nav className="nav-tabs nav-tabs-sm">
                {tabs.map(tabId => (
                    <a key={tabId} href="#" className={classnames({active: active === tabId})}
                       onClick={event => {
                           event.preventDefault()
                           dispatch(selectTab(tabId))
                       }}>
                        {allTabs[tabId].name}
                    </a>
                ))}
            </nav>
            <Tab flow={flow}/>
        </div>
    )
}
