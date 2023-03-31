import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./App.css";

interface Station {
    id: number;
    label: string;
}
interface Bus {
    id: number;
    name: string;
    stationIds: number[];
}

interface Route {
    startBus: Bus;
    endBus: Bus;
    startStation: Station | null;
    endStation: Station | null;
    switchStations: Station[];
}

const stations: Station[] = [
    { id: 1, label: "Hledan" },
    { id: 2, label: "Myaynigone" },
    { id: 3, label: "Yankin" },
    { id: 4, label: "Tamwe" },
    { id: 5, label: "Yuzana Plaza" },
    { id: 6, label: "Saint Paul" },
    { id: 7, label: "Suele" },
    { id: 8, label: "Thingangyun" },
    { id: 9, label: "South okkala" },
    { id: 10, label: "North okkala" },
    { id: 11, label: "Kabar Aye" },
    { id: 12, label: "Mm Plaza" },
    { id: 13, label: "Insein" },
    { id: 14, label: "South Dagon" },
    { id: 15, label: "North Dagon" },
    { id: 16, label: "Bayli" },
    { id: 17, label: "Sinmalike" },
    { id: 18, label: "Kyimyindaing" },
];

const buses: Bus[] = [
    { id: 1, name: "Line 65", stationIds: [10, 11, 12, 3, 4, 5, 6, 7] },
    { id: 2, name: "Line 7", stationIds: [14, 8, 4, 5, 6, 7] },
    { id: 3, name: "Line 25", stationIds: [15, 16, 9, 4, 3, 2, 1] },
    { id: 4, name: "Line 14", stationIds: [18, 17, 1, 2, 3, 9, 16, 15] },
    { id: 5, name: "Line 50", stationIds: [4, 3, 2, 1, 13, 17, 18] },
    { id: 6, name: "Line 43", stationIds: [10, 11, 9, 8, 4] },
];
interface StartAndEndStation {
    startStation: Station | null;
    endStation: Station | null;
}

function App() {
    const [searchStations, setSearchStations] = useState<StartAndEndStation>({
        startStation: null,
        endStation: null,
    });
    const [routes, setRoutes] = useState<Route[]>();

    const searchRoutes = () => {
        let routes: Route[] = [];
        const hasBothStartAndEndStations =
            searchStations.startStation !== null &&
            searchStations.endStation !== null;
        if (!hasBothStartAndEndStations) return;

        // searching direct bus
        buses.forEach((currentBus) => {
            const hasStartStation = currentBus.stationIds.find(
                (stationid) => stationid === searchStations.startStation?.id
            );
            const hasEndStation = currentBus.stationIds.find(
                (stationid) => stationid === searchStations.endStation?.id
            );
            if (hasStartStation && hasEndStation)
                routes.push({
                    startBus: currentBus,
                    endBus: currentBus,
                    startStation: searchStations.startStation,
                    endStation: searchStations.endStation,
                    switchStations: [],
                });
        });

        // searching indirect buses

        const busesAvailableForStartStation = buses.filter((bus) =>
            bus.stationIds.find(
                (data) => data === searchStations.startStation?.id
            )
        );
        const busesAvailableForEndStation = buses.filter((bus) =>
            bus.stationIds.find(
                (data) => data === searchStations.endStation?.id
            )
        );

        busesAvailableForStartStation.forEach((currentBus) => {
            let commonStations: Station[] = [];
            // eachBusforStartStation is looping with all buses for end station
            busesAvailableForEndStation.forEach((secondBus) => {
                // checking currentBus with each bus for end Station
                //bus 1 with bus 4
                //some of bus 1 station ids is similar with some of bus 4 station ids >> they have common routes
                currentBus.stationIds.forEach((idData) => {
                    const sameStation = secondBus.stationIds.includes(idData);

                    if (sameStation)
                        stations.find((data) => {
                            const alreadyexist = commonStations.find(
                                (data) => data.id === idData
                            );
                            if (data.id === idData && !alreadyexist)
                                commonStations.push(data);
                            return null;
                        });
                });
                // if common station present ,
                // 1. check similar ways with direct bus ? if so , don't push
                //2.check already exist , if so ,don't push
                // push
                if (commonStations.length > 0) {
                    const isCommonWithDirectLine = routes.find(
                        (data) =>
                            data.startBus.id === secondBus.id ||
                            data.endBus.id === secondBus.id ||
                            data.startBus.id === currentBus.id ||
                            data.endBus.id === currentBus.id
                    );
                    const isAlreadyExist = routes.find(
                        (data) =>
                            data.startBus === currentBus &&
                            data.endBus === secondBus
                    );
                    if (isCommonWithDirectLine || isAlreadyExist) return;

                    routes.push({
                        startBus: currentBus,
                        endBus: secondBus,
                        startStation: searchStations.startStation,
                        endStation: searchStations.endStation,
                        switchStations: commonStations,
                    });
                }
            });
            setRoutes(routes);
        });
    };

    return (
        <div>
            <Box
                sx={{
                    maxWwidth: "500px",
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={stations}
                    sx={{ width: 300, mb: 2 }}
                    onChange={(e, value) => {
                        value &&
                            setSearchStations({
                                ...searchStations,
                                startStation: value,
                            });
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Station" />
                    )}
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={stations}
                    sx={{ width: 300, mb: 2 }}
                    onChange={(e, value) => {
                        value &&
                            setSearchStations({
                                ...searchStations,
                                endStation: value,
                            });
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Station" />
                    )}
                />
                <Button variant="outlined" onClick={searchRoutes}>
                    Search Routes
                </Button>
                <Box sx={{ mt: 2 }}>
                    {routes &&
                        routes.map((data) => {
                            if (data.switchStations.length === 0) {
                                return (
                                    <Accordion sx={{ width: 300 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <DirectionsBusIcon
                                                    sx={{ color: "red" }}
                                                />
                                                {data.startBus.name}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography></Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            } else {
                                return (
                                    <Accordion sx={{ width: 300 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <DirectionsBusIcon
                                                    sx={{ color: "red" }}
                                                />
                                                {data.startBus.name}
                                                <ArrowForwardIosIcon
                                                    sx={{
                                                        color: "grey",
                                                        ml: 1,
                                                        mr: 1,
                                                    }}
                                                />
                                                <DirectionsBusIcon
                                                    sx={{ color: "red" }}
                                                />
                                                {data.endBus.name}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {data.switchStations.map(
                                                (station) => {
                                                    return (
                                                        <p>
                                                            You can change
                                                            stations at{" "}
                                                            <b>
                                                                {station.label}
                                                            </b>
                                                        </p>
                                                    );
                                                }
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            }
                        })}
                </Box>
            </Box>
        </div>
    );
}

export default App;
