import { AltDataStatistics } from "../schema/alt-gosling-schema";


export function renderDataPanel(altDataStatistics: AltDataStatistics, previousAltDataStatistics: AltDataStatistics) {

    if (altDataStatistics.id === previousAltDataStatistics.id) {
        determineDifferenceDataPanels()
    } else {
        renderNewDataPanel(altDataStatistics)
    }

}


function renderNewDataPanel(altDataStatistics: AltDataStatistics) {
    

}

function determineDifferenceDataPanels() {

}