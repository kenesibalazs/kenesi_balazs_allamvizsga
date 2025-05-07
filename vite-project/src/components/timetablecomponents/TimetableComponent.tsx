import React, { useEffect, useState } from "react";
import { Occasion } from "../../types/apitypes";
import { generateOccasionInstances } from "../../utils/occasionUtils";
import { LeftOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import { getEmptySlots } from "../../utils/timetabelUtils";

import './TimetableComponent.css'


interface TimetableProps {
    occasions: Occasion[];
}


const TimetableComponent: React.FC<TimetableProps> = ({ occasions }) => {
    const timetableStartHour = 0;
    const timetableEndHour = 24;
    const hourHeight = 60;

    useEffect(() =>
        console.log(occasions)
    )

    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");


    const getMondayOfWeek = (offset: number) => {
        const now = new Date();
        let day = now.getDay();
        if (day === 0) day = 7;
        now.setDate(now.getDate() - day + 1 + offset * 7);
        return now;
    };

    const monday = getMondayOfWeek(currentWeekOffset);
    const today = new Date();

    const occasionInstances = generateOccasionInstances(occasions);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // update every minute

        return () => clearInterval(interval); // cleanup
    }, []);

    return (
        <div className="timetable-container">
            <div className="header-container-navigation ">
                <p className="header-title-label ">
                    {monday.toLocaleDateString("en-US", { month: "long" })},
                    {monday.toLocaleDateString("en-US", { year: "numeric" })}
                </p>

                <nav className="tab-bar">
                    <button
                        className={viewMode === "month" ? "active" : ""}
                        onClick={() => setViewMode("month")}
                    >
                        Month
                    </button>
                    <button
                        className={viewMode === "week" ? "active" : ""}
                        onClick={() => setViewMode("week")}
                    >
                        Week
                    </button>
                    <button
                        className={viewMode === "day" ? "active" : ""}
                        onClick={() => setViewMode("day")}
                    >
                        Day
                    </button>
                </nav>
                <div className="day-navigation">
                    <a onClick={() => setCurrentWeekOffset((prev) => prev - 1)}><LeftOutlined /></a>
                    <p>Today</p>
                    <a onClick={() => setCurrentWeekOffset((prev) => prev + 1)}> <RightOutlined /></a>
                </div>
            </div>
            {viewMode === "week" && (
                <div className="timetable">
                    <div className="timetable-header">
                        <div className="time-column"></div>
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date(monday);
                            date.setDate(monday.getDate() + i);
                            const isToday = date.toDateString() === today.toDateString();

                            return (
                                <div key={i} className={`day-header ${isToday ? "today-highlight" : ""}`}>
                                    <p className="day-name">
                                        {date.toLocaleDateString("en-US", { weekday: "long" })}
                                    </p>
                                    <p className="day-number">
                                        {date.toLocaleDateString("en-US", { day: "numeric" })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="timetable-body-wrapper">
                        <div className="timetable-body">
                            <div className="time-column">
                                {Array.from({ length: timetableEndHour - timetableStartHour }).map((_, i) => (
                                    <div key={i} className="time-label" style={{ height: `${hourHeight}px` }}>
                                        {`${timetableStartHour + i}:00`}
                                    </div>
                                ))}
                            </div>

                            <div className="days-grid">
                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                    const dayDate = new Date(monday);
                                    dayDate.setDate(monday.getDate() + dayIndex);
                                    const isToday = dayDate.toDateString() === today.toDateString();

                                    return (
                                        <div key={dayIndex} className={`day-column ${isToday ? "today-column-highlight" : ""}`}>
                                            {occasionInstances
                                                .filter((instance) => instance.date.toDateString() === dayDate.toDateString())
                                                .map((instance, idx) => {
                                                    const startTime = new Date(instance.date);
                                                    const startHour = startTime.getHours();
                                                    const startMinute = startTime.getMinutes();



                                                    const endTime = new Date(instance.endDate);
                                                    // const endHour = endTime.getHours();
                                                    // const endMinute = endTime.getMinutes();

                                                    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                                                    const height = (durationInMinutes / 60) * hourHeight;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="occasion"
                                                            style={{
                                                                top: `${(startHour - timetableStartHour) * hourHeight + (startMinute / 60) * hourHeight}px`,
                                                                height: `${height}px`,
                                                            }}
                                                        >
                                                            <div className="occasion-details">
                                                                <a>

                                                                    {typeof instance.occasion.subjectId === 'object' ? instance.occasion.subjectId.name : 'Unknown Subject'}
                                                                </a>
                                                                <p>{instance.occasion.startTime} - {instance.occasion.endTime}</p>
                                                                {typeof instance.occasion.teacherId === 'object' ? instance.occasion.teacherId.name : 'Unknown Teacher'}
                                                                <br />
                                                                {typeof instance.occasion.classroomId === 'object' ? instance.occasion.classroomId.name : 'Unknown Classroom'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            {isToday && (
                                                <div
                                                    className="current-time-indicator"
                                                    style={{
                                                        top: `${((currentTime.getHours() - timetableStartHour) * hourHeight + (currentTime.getMinutes() / 60) * hourHeight)}px`,
                                                    }}
                                                >
                                                    <div className="time-bubble">
                                                        {currentTime.getHours().toString().padStart(2, "0")}:
                                                        {currentTime.getMinutes().toString().padStart(2, "0")}
                                                    </div>
                                                    <div className="indicator-line" />
                                                </div>
                                            )}
                                            {getEmptySlots(dayDate, occasions).map((emptySlot) => {

                                                const startOffset =
                                                    (emptySlot.startHour - timetableStartHour) * hourHeight +
                                                    (emptySlot.startMinute / 60) * hourHeight;
                                                const durationInMinutes =
                                                    emptySlot.endHour * 60 +
                                                    emptySlot.endMinute -
                                                    (emptySlot.startHour * 60 + emptySlot.startMinute);
                                                const height = (durationInMinutes / 60) * hourHeight;




                                                return (

                                                    <div
                                                        className="no-occasion"
                                                        style={{ top: `${startOffset}px`, height: `${height}px` }}
                                                    >
                                                        <p>
                                                            <PlusOutlined />
                                                        </p>
                                                    </div>
                                                );
                                            })}




                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === "day" && (
                <div className="timetable">
                    Here will be implemented the day view
                </div>
            )}

            {viewMode === "month" && (
                <div className="month-view">
                    Here will be implemented the month view
                </div>
            )}

            {/* {isModalVisible && selectedOccasion && selectedDate && (
                <TimetableModal
                    isVisible={isModalVisible}
                    occasion={selectedOccasion}
                    selectedDate={selectedDate}
                    onClose={closeModal}
                />
            )} */}
        </div>
    );
};

export default TimetableComponent;