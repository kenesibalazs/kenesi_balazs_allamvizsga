import React from 'react';
import {
    IoAlertCircleOutline,
    IoCheckmarkCircleOutline,
    IoChevronForwardOutline,
    IoInformationCircleOutline,
} from 'react-icons/io5';
import './SmallDataCard.css';
import { SmallDataCardProps } from '../../types';

const SmallDataCard: React.FC<SmallDataCardProps> = ({
    leading,
    label,
    data,
    showWarning,
    warningMessage = "No data available.",
    warningFunction,
    showAbsence = false
}) => {
    const isLabelArray = Array.isArray(label);
    const labelsArray = isLabelArray ? label : [label];

    return (
        <div className="info-card">
            <div className="info-row">
                {typeof leading === 'string' ? (
                    <div className="leading-text">{leading}</div>
                ) : (
                    <div className="info-icon">
                        <IoInformationCircleOutline size={18} color="#067BC2" />
                    </div>
                )}

                <div className="info-separator" />

                <div className="info-card-details">
                    {label && <div className="label">{label}</div>}

                    {showWarning ? (
                        <button className="warning-button" onClick={warningFunction || (() => console.warn(warningMessage))}>
                            <IoAlertCircleOutline size={18} color="red" />
                            <span className="warning-text">{warningMessage}</span>
                        </button>
                    ) : (
                        data?.map((item, index) => (
                            <div className="data-block" key={index}>
                                {item.topLabel && <div className="top-label">{item.topLabel}</div>}
                                <div
                                    className="value-row"
                                    onClick={item.onPressFunction}
                                    role={item.onPressFunction ? 'button' : undefined}
                                    tabIndex={item.onPressFunction ? 0 : -1}
                                >
                                    <div className="info-text">{item.value}</div>

                                    {showAbsence && (item.abbsenceLabel === "present" || item.abbsenceLabel === "absent") && (
                                        <div className={item.abbsenceLabel === "present" ? "present-container" : "absent-container"}>
                                            {item.abbsenceLabel === "present" ? (
                                                <IoCheckmarkCircleOutline size={18} color="green" />
                                            ) : (
                                                <IoAlertCircleOutline size={18} color="red" />
                                            )}
                                            <span className={item.abbsenceLabel === "present" ? "present-text" : "absent-text"}>
                                                {item.abbsenceLabel.charAt(0).toUpperCase() + item.abbsenceLabel.slice(1)}
                                            </span>
                                        </div>
                                    )}

                                    {showAbsence && item.abbsenceLabel !== "present" && item.abbsenceLabel !== "absent" && (
                                        <span className="teacher-attendance-text">{item.abbsenceLabel}</span>
                                    )}

                                    {item.onPressFunction && (
                                        <IoChevronForwardOutline size={20} color="#A9A9A9" style={{ marginLeft: 8 }} />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmallDataCard;