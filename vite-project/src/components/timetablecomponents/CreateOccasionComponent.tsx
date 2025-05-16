/* eslint-disable */
import React from "react";

interface CreateOccasionProps {
    startMinute: number;
    startHour: number;
    endMinute: number;
    endHour: number;
    day: string;
}

const CreateOccasionComponent: React.FC<CreateOccasionProps> = ({ startMinute, startHour, endMinute, endHour, day }) => {

    const timetableStartHour = 0;
    const timetableEndHour = 24;
    const hourHeight = 60;

    const startOffset =
        (startHour - timetableStartHour) * hourHeight +
        (startMinute / 60) * hourHeight;
    const durationInMinutes =
        endHour * 60 +
        endMinute -
        (startHour * 60 + startMinute);
    const height = (durationInMinutes / 60) * hourHeight;


    return (
        <div className="create-occasion"

            style={{ top: `${startOffset}px`, height: `${height}px` }}
        >
            <p>
                {startHour}:{startMinute}
            </p>
            <p>
               {endHour}:{endMinute}
            </p>
        </div>
    );
}

export default CreateOccasionComponent