// import React, { useEffect, useRef, useState, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   CircularProgress,
//   Button,
//   Fade,
// } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import { formatNumber } from "../utils/formatNumber";
// import MedalCard from "../components/MedalCard";
// import ActiveEventAccordionCard from "../components/ActiveEventAccordionCard";
// import EventParticipationCard from "../components/EventParticipationCard";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface Medal {
//   _id: string;
//   createdAt: string;
//   type: string;
//   image: string;
//   value: number;
//   status: string;
//   [key: string]: any; // ✅ solo una volta
// }

// interface Event {
//   _id: string;
//   id: string;
//   eventType: string;
//   completedAt: string;
//   winnerId: string | null;
//   winnerUsername?: string;
//   medalValue: number | null;
//   [key: string]: any;
// }

// interface MedalType {
//   value: number;
//   image: string;
// }

// interface ArrowProps {
//   className?: string;
//   style?: React.CSSProperties;
//   onClick?: () => void;
// }

// interface UserData {
//   _id?: string;
//   username: string;
//   coinBalance: {
//     total: number;
//     withdrawable?: number;
//   };
// }

// interface Medal {
//   _id: string;
//   createdAt: string;
//   [key: string]: any;
// }

// interface Event {
//   _id: string;
//   completedAt: string;
//   [key: string]: any;
// }

// interface Summary {
//   totals: {
//     total: number;
//     won: number;
//     trophies: number;
//     trophiesValue: number;
//   };
// }

// interface MedalType {
//   [key: string]: any;
// }

// interface ActiveEvent {
//   instanceId: string;
//   eventName: string;
//   description: string;
//   partecipanti: number;
//   myTickets: number;
//   isMegaEvent: boolean;
//   participantsRequired: number;
//   isMulti: boolean;
// }

// const NextArrow = (props: ArrowProps) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: "block",
//         right: 10,
//         zIndex: 2,
//         color: "#00e676",
//       }}
//       onClick={onClick}
//     />
//   );
// };

// const PrevArrow = (props: ArrowProps) => {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: "block",
//         left: 10,
//         zIndex: 2,
//         color: "#00e676",
//       }}
//       onClick={onClick}
//     />
//   );
// };

// const HomeScreen = () => {
//   const navigate = useNavigate();
//   const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
//   const [userData, setUserData] = useState<UserData>({
//     coinBalance: { total: 0 },
//     username: "Utente",
//   });
//   const [events, setEvents] = useState<Event[]>([]);
//   const [medals, setMedals] = useState<Medal[]>([]);
//   const [summary, setSummary] = useState<Summary>({
//     totals: { total: 0, won: 0, trophies: 0, trophiesValue: 0 },
//   });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [medalTypes, setMedalTypes] = useState<MedalType[]>([]);
//   const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
//   const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
//   const fadeIn = useRef<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => setScreenWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchData = useCallback(async () => {
//     const token = localStorage.getItem("authToken");
//     if (!token) return;

//     const headers = { Authorization: `Bearer ${token}` };

//     try {
//       const [resUser, resEvents, resMedals, resSummary, resMedalTypes] =
//         await Promise.allSettled([
//           axios.get(`${API_BASE_URL}/users/me`, { headers }),
//           axios.get(`${API_BASE_URL}/events/history?limit=30`, { headers }),
//           axios.get(`${API_BASE_URL}/medals/recent-visible`, { headers }),
//           axios.get(`${API_BASE_URL}/medals/summary`, { headers }),
//           axios.get(`${API_BASE_URL}/medals-types`, { headers }),
//         ]);

//       if (resUser.status === "fulfilled") setUserData(resUser.value.data);
//       if (resEvents.status === "fulfilled") setEvents(resEvents.value.data);
//       if (resMedals.status === "fulfilled") setMedals(resMedals.value.data);
//       if (resSummary.status === "fulfilled") setSummary(resSummary.value.data);
//       if (resMedalTypes.status === "fulfilled")
//         setMedalTypes(resMedalTypes.value.data);

//       const resActiveEvents = await axios.get(
//         `${API_BASE_URL}/events/list/upcoming`,
//         { headers }
//       );

//       if (resActiveEvents.data) {
//         const userId =
//           resUser.status === "fulfilled" ? resUser.value.data._id : null;

//         const enriched: ActiveEvent[] = resActiveEvents.data
//           .filter((i: any) => i.status !== "completed")
//           .map((i: any): ActiveEvent => {
//             const totalTickets = i.participants.reduce(
//               (sum: number, p: any) => sum + (p.tickets || 1),
//               0
//             );
//             const myTickets = userId
//               ? i.participants
//                   .filter((p: any) => p.userId?._id === userId)
//                   .reduce((sum: number, p: any) => sum + (p.tickets || 1), 0)
//               : 0;
//             return {
//               instanceId: i._id,
//               eventName: i.eventType?.name || "Evento Sconosciuto",
//               description: i.eventType?.description || "",
//               partecipanti: totalTickets,
//               myTickets,
//               isMegaEvent: i.eventType?.isMegaEvent || false,
//               participantsRequired: i.eventType?.participantsRequired || 0,
//               isMulti: i.eventType?.allowMultipleTickets || false,
//             };
//           })
//           .filter((e) => e.myTickets > 0);

//         setActiveEvents(enriched);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//     fadeIn.current = true;
//   }, [fetchData]);

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//       >
//         <CircularProgress color="success" />
//       </Box>
//     );
//   }

//   const maxContentWidth = Math.min(screenWidth, 1200);
//   const cardWidth = 280;

//   const sliderSettings = (itemsLength: number) => ({
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: Math.max(1, Math.floor(maxContentWidth / (cardWidth + 16))),
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     arrows: true,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   });

//   const totalMedals = summary?.totals?.total ?? 0;
//   const wonMedals = summary?.totals?.won ?? 0;
//   const trophies = summary?.totals?.trophies ?? 0;
//   const trophiesValue = summary?.totals?.trophiesValue ?? 0;
//   const recentWonMedals = medals
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )
//     .slice(0, 10);
//   const recentUserEvents = events
//     .sort(
//       (a, b) =>
//         new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
//     )
//     .slice(0, 10);

//   return (
//     <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 3 }}>
//       <Box sx={{ maxWidth: maxContentWidth, mx: "auto" }}>
//         <Typography
//           variant="h5"
//           color="white"
//           textAlign="center"
//           fontWeight="bold"
//           gutterBottom
//         >
//           Benvenuto, {userData.username.toLowerCase()}
//         </Typography>

//         <Fade in={fadeIn.current} timeout={1000}>
//           <Paper
//             elevation={3}
//             sx={{ backgroundColor: "#1c1c1e", p: 3, mb: 4, borderRadius: 2 }}
//           >
//             <Grid
//               container
//               spacing={3}
//               justifyContent="center"
//               alignItems="center"
//             >
//               <Grid item xs={12} sm={4} textAlign="center">
//                 <Typography color="#00e676" variant="subtitle2">
//                   Coin
//                 </Typography>
//                 <Typography color="white" fontWeight={600}>
//                   {formatNumber(userData.coinBalance.total)}
//                 </Typography>
//                 <Typography variant="caption" color="gray">
//                   Prelevabili:{" "}
//                   {formatNumber(userData.coinBalance.withdrawable ?? 0)}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={4} textAlign="center">
//                 <Typography color="#00e676" variant="subtitle2">
//                   Medaglie
//                 </Typography>
//                 <Typography color="white" fontWeight={600}>
//                   {formatNumber(totalMedals)}
//                 </Typography>
//                 <Typography variant="caption" color="gray">
//                   Vinte: {wonMedals}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={4} textAlign="center">
//                 <Typography color="#00e676" variant="subtitle2">
//                   Coppe
//                 </Typography>
//                 <Typography color="white" fontWeight={600}>
//                   {formatNumber(trophies)}
//                 </Typography>
//                 <Typography variant="caption" color="gray">
//                   Valore: {formatNumber(trophiesValue)}€
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Fade>
//         {recentWonMedals.length > 0 && (
//           <Box mb={4}>
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={1}
//             >
//               <Typography color="white">Le mie Medaglie</Typography>
//               <Button
//                 onClick={() => navigate("/app/medaglie")}
//                 sx={{ color: "#00e676" }}
//               >
//                 Vedi tutte
//               </Button>
//             </Box>
//             <Slider {...sliderSettings(recentWonMedals.length)}>
//               {recentWonMedals.map((medal) => (
//                 <Box key={medal._id} px={1} sx={{ width: cardWidth }}>
//                   <MedalCard
//                     medal={medal}
//                     isFlipped={flippedCardId === medal._id}
//                     onPress={() =>
//                       setFlippedCardId((prev) =>
//                         prev === medal._id ? null : medal._id
//                       )
//                     }
//                     onPressDetail={() =>
//                       navigate("/app/medaglie/detail/" + medal._id)
//                     }
//                     onAutoClose={() => setFlippedCardId(null)}
//                   />
//                 </Box>
//               ))}
//             </Slider>
//           </Box>
//         )}

//         {activeEvents.length > 0 && (
//           <Box mb={4}>
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={1}
//             >
//               <Typography color="white">Eventi Attivi</Typography>
//               <Button
//                 onClick={() => navigate("/app/events")}
//                 sx={{ color: "#00e676" }}
//               >
//                 Vedi tutti
//               </Button>
//             </Box>
//             {activeEvents.map((event) => (
//               <ActiveEventAccordionCard key={event.instanceId} {...event} />
//             ))}
//           </Box>
//         )}

//         <Box>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={1}
//           >
//             <Typography color="white">Ultimi Eventi Partecipati</Typography>
//             <Button
//               onClick={() => navigate("/app/home/completed")}
//               sx={{ color: "#00e676" }}
//             >
//               Vedi tutti
//             </Button>
//           </Box>
//           {recentUserEvents.length > 0 ? (
//             <Slider {...sliderSettings(recentUserEvents.length)}>
//               {recentUserEvents.map((event) => (
//                 <Box key={event._id} px={1} sx={{ width: cardWidth }}>
//                   <EventParticipationCard
//                     event={event}
//                     currentUserId={userData._id || ""}
//                     medalTypes={medalTypes}
//                   />
//                 </Box>
//               ))}
//             </Slider>
//           ) : (
//             <Typography color="gray" textAlign="center">
//               Nessun evento partecipato
//             </Typography>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default HomeScreen;

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Fade,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { formatNumber } from "../utils/formatNumber";
import MedalCard from "../components/MedalCard";
import ActiveEventAccordionCard from "../components/ActiveEventAccordionCard";
import EventParticipationCard from "../components/EventParticipationCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface UserData {
  _id?: string;
  username: string;
  coinBalance: {
    total: number;
    withdrawable?: number;
  };
}

interface Medal {
  _id: string;
  createdAt: string;
  type: string;
  image: string;
  value: number;
  status: string;
  [key: string]: any;
}

interface Event {
  _id: string;
  id: string;
  eventType: string;
  completedAt: string;
  winnerId: string | null;
  winnerUsername?: string;
  medalValue: number | null;
  [key: string]: any;
}

interface MedalType {
  value: number;
  image: string;
}

interface Summary {
  totals: {
    total: number;
    won: number;
    trophies: number;
    trophiesValue: number;
  };
}

interface ActiveEvent {
  instanceId: string;
  eventName: string;
  description: string;
  partecipanti: number;
  myTickets: number;
  isMegaEvent: boolean;
  participantsRequired: number;
  isMulti: boolean;
}

const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        right: 10,
        zIndex: 2,
        color: "#00e676",
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        left: 10,
        zIndex: 2,
        color: "#00e676",
      }}
      onClick={onClick}
    />
  );
};

const HomeScreen = () => {
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [userData, setUserData] = useState<UserData>({
    coinBalance: { total: 0 },
    username: "Utente",
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [medals, setMedals] = useState<Medal[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totals: { total: 0, won: 0, trophies: 0, trophiesValue: 0 },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [medalTypes, setMedalTypes] = useState<MedalType[]>([]);
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const fadeIn = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resUser, resEvents, resMedals, resSummary, resMedalTypes] =
        await Promise.allSettled([
          axios.get(`${API_BASE_URL}/users/me`, { headers }),
          axios.get(`${API_BASE_URL}/events/history?limit=30`, { headers }),
          axios.get(`${API_BASE_URL}/medals/recent-visible`, { headers }),
          axios.get(`${API_BASE_URL}/medals/summary`, { headers }),
          axios.get(`${API_BASE_URL}/medals-types`, { headers }),
        ]);

      if (resUser.status === "fulfilled") setUserData(resUser.value.data);
      if (resEvents.status === "fulfilled") setEvents(resEvents.value.data);
      if (resMedals.status === "fulfilled") setMedals(resMedals.value.data);
      if (resSummary.status === "fulfilled") setSummary(resSummary.value.data);
      if (resMedalTypes.status === "fulfilled")
        setMedalTypes(resMedalTypes.value.data);

      const resActiveEvents = await axios.get(
        `${API_BASE_URL}/events/list/upcoming`,
        { headers }
      );

      if (resActiveEvents.data) {
        const userId =
          resUser.status === "fulfilled" ? resUser.value.data._id : null;

        const enriched: ActiveEvent[] = resActiveEvents.data
          .filter((i: any) => i.status !== "completed")
          .map((i: any): ActiveEvent => {
            const totalTickets = i.participants.reduce(
              (sum: number, p: any) => sum + (p.tickets || 1),
              0
            );
            const myTickets = userId
              ? i.participants
                  .filter((p: any) => p.userId?._id === userId)
                  .reduce((sum: number, p: any) => sum + (p.tickets || 1), 0)
              : 0;
            return {
              instanceId: i._id,
              eventName: i.eventType?.name || "Evento Sconosciuto",
              description: i.eventType?.description || "",
              partecipanti: totalTickets,
              myTickets,
              isMegaEvent: i.eventType?.isMegaEvent || false,
              participantsRequired: i.eventType?.participantsRequired || 0,
              isMulti: i.eventType?.allowMultipleTickets || false,
            };
          })
          .filter((e: ActiveEvent) => e.myTickets > 0);

        setActiveEvents(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fadeIn.current = true;
  }, [fetchData]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  const maxContentWidth = Math.min(screenWidth, 1200);
  const cardWidth = 280;

  const sliderSettings = (itemsLength: number) => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.max(1, Math.floor(maxContentWidth / (cardWidth + 16))),
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  });

  const totalMedals = summary?.totals?.total ?? 0;
  const wonMedals = summary?.totals?.won ?? 0;
  const trophies = summary?.totals?.trophies ?? 0;
  const trophiesValue = summary?.totals?.trophiesValue ?? 0;

  const recentWonMedals = medals
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const recentUserEvents = events
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 10);

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", p: 3 }}>
      <Box sx={{ maxWidth: maxContentWidth, mx: "auto" }}>
        <Typography
          variant="h5"
          color="white"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Benvenuto, {userData.username.toLowerCase()}
        </Typography>

        <Fade in={fadeIn.current} timeout={1000}>
          <Paper
            elevation={3}
            sx={{ backgroundColor: "#1c1c1e", p: 3, mb: 4, borderRadius: 2 }}
          >
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sm={4} textAlign="center">
                <Typography color="#00e676" variant="subtitle2">
                  Coin
                </Typography>
                <Typography color="white" fontWeight={600}>
                  {formatNumber(userData.coinBalance.total)}
                </Typography>
                <Typography variant="caption" color="gray">
                  Prelevabili:{" "}
                  {formatNumber(userData.coinBalance.withdrawable ?? 0)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} textAlign="center">
                <Typography color="#00e676" variant="subtitle2">
                  Medaglie
                </Typography>
                <Typography color="white" fontWeight={600}>
                  {formatNumber(totalMedals)}
                </Typography>
                <Typography variant="caption" color="gray">
                  Vinte: {wonMedals}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} textAlign="center">
                <Typography color="#00e676" variant="subtitle2">
                  Coppe
                </Typography>
                <Typography color="white" fontWeight={600}>
                  {formatNumber(trophies)}
                </Typography>
                <Typography variant="caption" color="gray">
                  Valore: {formatNumber(trophiesValue)}€
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {recentWonMedals.length > 0 && (
          <Box mb={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography color="white">Le mie Medaglie</Typography>
              <Button
                onClick={() => navigate("/app/medaglie")}
                sx={{ color: "#00e676" }}
              >
                Vedi tutte
              </Button>
            </Box>
            <Slider {...sliderSettings(recentWonMedals.length)}>
              {recentWonMedals.map((medal) => (
                <Box key={medal._id} px={1} sx={{ width: cardWidth }}>
                  <MedalCard
                    medal={medal}
                    onPressDetail={() =>
                      navigate("/app/medaglie/detail/" + medal._id)
                    }
                    onAutoClose={() => setFlippedCardId(null)}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        )}
        {activeEvents.length > 0 && (
          <Box mb={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography color="white">Eventi Attivi</Typography>
              <Button
                onClick={() => navigate("/app/events")}
                sx={{ color: "#00e676" }}
              >
                Vedi tutti
              </Button>
            </Box>
            {activeEvents.map((event) => (
              <ActiveEventAccordionCard key={event.instanceId} {...event} />
            ))}
          </Box>
        )}

        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography color="white">Ultimi Eventi Partecipati</Typography>
            <Button
              onClick={() => navigate("/app/home/completed")}
              sx={{ color: "#00e676" }}
            >
              Vedi tutti
            </Button>
          </Box>
          {recentUserEvents.length > 0 ? (
            <Slider {...sliderSettings(recentUserEvents.length)}>
              {recentUserEvents.map((event) => (
                <Box key={event._id} px={1} sx={{ width: cardWidth }}>
                  <EventParticipationCard
                    event={event}
                    currentUserId={userData._id || ""}
                    medalTypes={medalTypes}
                  />
                </Box>
              ))}
            </Slider>
          ) : (
            <Typography color="gray" textAlign="center">
              Nessun evento partecipato
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomeScreen;
