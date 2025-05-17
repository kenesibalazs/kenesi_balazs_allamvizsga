import React, { useEffect, useState, useRef } from "react";
import { DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { Occasion } from "../../types/apitypes";
import { generateOccasionInstances } from "../../utils/occasionUtils";
import CreateOccasionModal from '../timetablecomponents/CreateOccasionModal';
import "./TodayScheduleCard.css";
const TodaysScheduleCard: React.FC<{
    occasions: Occasion[];
}> = ({ occasions }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    const timelineRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSlotData, setSelectedSlotData] = useState<{ startHour: number; startMinute: number; endHour: number; endMinute: number; date: Date } | null>(null);


    const handelAddOccasionOnClick = (slot: { startHour: number; startMinute: number; endHour: number; endMinute: number }, date: Date) => {
        setSelectedSlotData({ ...slot, date });
        setIsModalVisible(true);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timelineRef.current && indicatorRef.current) {
            const indicatorLeft = indicatorRef.current.offsetLeft;
            timelineRef.current.scrollLeft = indicatorLeft - timelineRef.current.clientWidth / 2;
        }
    }, [selectedDate, currentTime]);

    const todayInstances = generateOccasionInstances(occasions).filter(
        (instance) => instance.date.toDateString() === selectedDate.toDateString()
    );

    const hourWidth = 100;
    const startHour = 0;
    const endHour = 23;
    const totalHours = endHour - startHour;

    const rows: { left: number; width: number; element: JSX.Element }[][] = [[], [], [], []];

    todayInstances.forEach((instance, i) => {
        const { occasion, date, endDate } = instance;
        const start = date.getHours() + date.getMinutes() / 60;
        const end = endDate.getHours() + endDate.getMinutes() / 60;
        const left = (start - startHour) * hourWidth;
        const width = (end - start) * hourWidth;
        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;

        const occElement = (
            <div
                key={i}
                className="mini-occasion"
                style={{
                    left: `${left}px`,
                    width: `${width}px`,
                    backgroundColor: randomColor,
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    borderRadius: "8px",
                    padding: "2px 6px",
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {typeof occasion.subjectId === "object"
                    ? occasion.subjectId.name
                    : "Occasion"}
            </div>
        );

        for (let row of rows) {
            if (!row.some(r => left < r.left + r.width && left + width > r.left)) {
                row.push({ left, width, element: occElement });
                break;
            }
        }
    });

    return (
        <div className="card">
            <div
                className="toaday-schedule-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <h3>Schedule</h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <DatePicker
                        value={dayjs(selectedDate)}
                        onChange={(date) => {
                            if (date) setSelectedDate(date.toDate());
                        }}
                        allowClear={false}
                    />
                    <button
                        className="add-occasion-button"
                        onClick={() => {
                            const now = new Date();
                            const currentHour = now.getHours();
                            handelAddOccasionOnClick(
                                {
                                    startHour: currentHour,
                                    startMinute: 0,
                                    endHour: currentHour + 2,
                                    endMinute: 0,
                                },
                                selectedDate
                            );
                        }}
                    >
                        Add Occasion
                    </button>
                </div>
            </div>
            <div
                className="timeline-scroll"
                ref={timelineRef}
                style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                }}
            >
                <div style={{ minWidth: `${hourWidth * totalHours}px`, position: "relative" }}>
                    {selectedDate.toDateString() === new Date().toDateString() && (
                        <div
                            className="past-time-overlay"
                            style={{
                                width: `${(currentTime.getHours() + currentTime.getMinutes() / 60 - startHour) * hourWidth}px`
                            }}
                        />
                    )}
                    <div className="time-row" style={{ display: "flex" }}>
                        {Array.from({ length: totalHours }).map((_, i) => (
                            <div
                                key={i}
                                className="time-label"
                                style={{
                                    width: `${hourWidth}px`,
                                    textAlign: "center",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {startHour + i}:00
                            </div>
                        ))}
                    </div>
                    {selectedDate.toDateString() === new Date().toDateString() && (
                        <div
                            className="vertical-indicator"
                            ref={indicatorRef}
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: `${(currentTime.getHours() +
                                    currentTime.getMinutes() / 60 -
                                    startHour) *
                                    hourWidth
                                    }px`,
                                width: "2px",
                                backgroundColor: "red",
                                zIndex: 10,
                            }}
                        >
                            <div
                                className="time-bubble"
                                style={{
                                    position: "absolute",
                                    left: "-19px",
                                    backgroundColor: "red",
                                    color: "white",
                                    padding: "2px 6px",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    )}
                    {rows.map((row, rowIndex) =>
                    (

                        <div
                            key={rowIndex}
                            className="occasion-row"
                            style={{
                                position: "relative",
                                height: "40px",
                                marginBottom: "4px"
                            }}
                        >
                            {row.map((r, idx) => (
                                <React.Fragment key={idx}>{r.element}</React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <CreateOccasionModal
                visible={isModalVisible}
                slotData={selectedSlotData}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default TodaysScheduleCard;