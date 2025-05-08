import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineOccasionCardProps, Occasion } from "../../types";
import SmallDataCard from "../common/SmallDataCard";

// Grouped occasion wrapper type
type GroupedOccasion = { occasion: Occasion; date: Date; endDate: Date };

const TimelineOccasionCard: React.FC<TimelineOccasionCardProps> = ({ occasions }) => {
    const [showAll, setShowAll] = useState(false);
    const now = new Date();
    const navigate = useNavigate();

    // Ensure date strings are converted to Date objects
    const parsedOccasions = occasions.map(o => ({
        ...o,
        date: new Date(o.date),
        endDate: new Date(o.endDate),
    }));

    const filteredOccasions = parsedOccasions.filter(occasion => occasion.date > now);

    const groupedOccasions = Object.entries(
        filteredOccasions.reduce((acc, occasion) => {
            const now = new Date();
            const oneWeekLater = new Date();
            oneWeekLater.setDate(now.getDate() + 7);

            let dateKey = "";

            if (occasion.date <= oneWeekLater) {
                const day = occasion.date.getDate();
                const dayName = occasion.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                dateKey = `${day} ${dayName}`;

            } else {
                const day = occasion.date.getDate();
                const month = occasion.date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
                dateKey = `${day} ${month}`;
            }


            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(occasion);
            return acc;
        }, {} as Record<string, { occasion: Occasion; date: Date; endDate: Date }[]>)
    );

    const visibleDays = showAll ? groupedOccasions : groupedOccasions.slice(0, 3);

    const handleMorePress = (occasion: Occasion, startTime: string, endTime: string) => {
        navigate("/occasion-info", {
            state: { occasion, startTime, endTime }
        });
    };

    return (
        <div >
           <h3 className="title-my">Uppcoming Occasions</h3>

            <div className="fadeInLeft" style={{ animationDuration: "0.4s" }}>
                {visibleDays.map(([date, occasionsForDay], index) => (
                    <SmallDataCard
                        key={date + index}
                        leading={date.split(" ").join("\n")}
                        data={occasionsForDay.map(({ occasion, date, endDate }) => ({
                            topLabel: `${occasion.startTime} - ${occasion.endTime}`,
                            value: typeof occasion.subjectId === "object" && occasion.subjectId !== null
                                ? occasion.subjectId.name
                                : "Unknown Subject",
                            onPressFunction: () =>
                                handleMorePress(occasion, date.toISOString(), endDate.toISOString())
                        }))}
                    />
                ))}
            </div>
        </div>
    );
};



export default TimelineOccasionCard;