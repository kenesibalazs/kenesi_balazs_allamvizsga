import React, { useState } from "react";
import { Occasion } from "../../types/apitypes";
import { generateOccasionInstances } from "../../utils/occasionUtils";
import TimetableModal from "./TimetableModal";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './TimetableComponent.css'

interface TimetableProps {
    occasions: Occasion[];
}

const TimetableComponent: React.FC<TimetableProps> = ({ occasions }) => {
    const timetableStartHour = 8;
    const timetableEndHour = 22;
    const hourHeight = 60;

    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");
    // const [hoveredSlot, setHoveredSlot] = useState<{ dayIndex: number; hour: number } | null>(null);

    const getMondayOfWeek = (offset: number) => {
        const now = new Date();
        now.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
        return now;
    };

    const monday = getMondayOfWeek(currentWeekOffset);
    const today = new Date();

    const occasionInstances = generateOccasionInstances(occasions);

    const openModal = (occasion: Occasion, date: Date) => {
        setSelectedOccasion(occasion);
        setSelectedDate(date);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedOccasion(null);
        setSelectedDate(null);
    };

    return (
        <div className="timetable-container">
            <div className="timetable-container-navigation">
                <p className="month-label">
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

                    {/* <p>{getDayLabel(currentDate)}</p> */}

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

                                                    const [endHour, endMinute] = instance.occasion.endTime.split(":").map(Number);
                                                    const endTime = new Date(startTime);
                                                    endTime.setHours(endHour, endMinute, 0, 0);

                                                    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                                                    const height = (durationInMinutes / 60) * hourHeight;

                                                    if (instance) {
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="occasion"
                                                                style={{
                                                                    top: `${(startHour - timetableStartHour) * hourHeight + (startMinute / 60) * hourHeight}px`,
                                                                    height: `${height}px`,
                                                                }}
                                                                onClick={() => openModal(instance.occasion, instance.date)}
                                                            >

                                                                <div className="occasion-details">
                                                                    <a>
                                                                        {instance.occasion.subjectId}
                                                                    </a>
                                                                    <p>{instance.occasion.startTime} - {instance.occasion.endTime}</p>
                                                                    <p>{instance.occasion.classroomId}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="create-occasion"
                                                                style={{
                                                                    top: `${(startHour - timetableStartHour) * hourHeight + (startMinute / 60) * hourHeight}px`,
                                                                    height: `${height}px`,
                                                                }}
                                                            >
                                                            </div>
                                                        )
                                                    }
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
            {isModalVisible && selectedOccasion && selectedDate && (
                <TimetableModal
                    isVisible={isModalVisible}
                    occasion={selectedOccasion}
                    selectedDate={selectedDate}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default TimetableComponent;