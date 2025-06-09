import React, { useState, useEffect } from 'react';
import { Modal, DatePicker, Select, Checkbox, Form, Steps, notification } from 'antd';
import dayjs from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Occasion } from '../../types';
import useSubject from '../../hooks/useSubject';
import useClassroom from '../../hooks/useClassroom';
import useGroups from '../../hooks/useGroups';
import useOccasions from '../../hooks/useOccasions';
import './CreateOccasionModal.css';

interface SlotData {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    date: Date;
}

interface CreateOccasionModalProps {
    visible: boolean;
    slotData: SlotData | null;
    onClose: () => void;
}

const CreateOccasionModal: React.FC<CreateOccasionModalProps> = ({ visible, slotData, onClose }) => {
    const [isRepetitionChecked, setIsRepetitionChecked] = useState(false);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
    const [subject, setSubject] = useState<string | null>(null);
    const [classroom, setClassroom] = useState<string | null>(null);
    const [interval, setInterval] = useState<"weekly" | "bi-weekly" | null>(null);
    const [validUntil, setValidUntil] = useState<dayjs.Dayjs | null>(null);
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const { userData, logout, refreshUser } = useAuth();
    const { subjects, fetchSubjectsForTeacher } = useSubject();
    const { classrooms, fetchAllClassrooms } = useClassroom();
    const { groups, fetchAllGroupsData } = useGroups();
    const { createOccasion } = useOccasions();
    useEffect(() => {
      if (visible) {
        fetchAllGroupsData();
      }
    }, [visible, fetchAllGroupsData]);

    if (!userData) {
        logout();
        return null;
    }
    
    useEffect(() => {
        if (visible && slotData) {
            const baseDate = new Date(slotData.date);
            setStartDate(dayjs(new Date(baseDate.setHours(slotData.startHour, slotData.startMinute))));
            setEndDate(dayjs(new Date(slotData.date.setHours(slotData.endHour, slotData.endMinute))));
        }
    }, [visible, slotData]);

    useEffect(() => {
      if (visible && userData?._id) {
        fetchSubjectsForTeacher(userData._id);
      }
    }, [visible, userData, fetchSubjectsForTeacher]);

    useEffect(() => {
      if (visible) {
        fetchAllClassrooms();
      }
    }, [visible, fetchAllClassrooms]);

    return (
        <Modal
            className="create-occasion-modal"
            title="Create Occasion"
            open={visible}
            onCancel={() => {
                setIsRepetitionChecked(false);
                setStartDate(slotData ? dayjs(new Date(slotData.date.setHours(slotData.startHour, slotData.startMinute))) : null);
                setEndDate(slotData ? dayjs(new Date(slotData.date.setHours(slotData.endHour, slotData.endMinute))) : null);
                setSubject(null);
                setClassroom(null);
                setInterval(null);
                setValidUntil(null);
                setSelectedParticipants([]);
                setCurrentStep(0);
                onClose();
            }}
            footer={null}
        >
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
                <Steps.Step title="Basic Info" />
                <Steps.Step title="Repetition" />
                <Steps.Step title="Participants" />
            </Steps>

            <div style={{ minHeight: '280px' }}>
                {currentStep === 0 && (
                    <Form layout="vertical">
                        <Form.Item label="Start Time" required>
                            <DatePicker
                                showTime={{ format: 'HH:mm' }}
                                value={startDate}
                                onChange={(value) => setStartDate(value)}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="End Time" required>
                            <DatePicker
                                showTime={{ format: 'HH:mm' }}
                                value={endDate}
                                onChange={(value) => setEndDate(value)}
                                disabledDate={(current) =>
                                    startDate ? current && current.format('YYYY-MM-DD') !== startDate.format('YYYY-MM-DD') : false
                                }
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="Subject" required>
                            <Select placeholder="Select subject" value={subject} onChange={(value) => setSubject(value)}>
                                {subjects.map((s) => (
                                  <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Classroom" required>
                            <Select placeholder="Select classroom" value={classroom} onChange={(value) => setClassroom(value)}>
                                {classrooms.map((c) => (
                                  <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                )}

                {currentStep === 1 && (
                    <Form layout="vertical">
                        <Form.Item>
                            <Checkbox checked={isRepetitionChecked} onChange={(e) => setIsRepetitionChecked(e.target.checked)}>Repetition</Checkbox>
                        </Form.Item>
                        {isRepetitionChecked && (
                            <>
                                <Form.Item label="Interval">
                                    <Select placeholder="Select interval" value={interval} onChange={(value) => setInterval(value)}>
                                        <Select.Option value="weekly">Weekly</Select.Option>
                                        <Select.Option value="bi-weekly">Bi-weekly</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Repeat Until">
                                    <DatePicker
                                        showTime={{ format: 'HH:mm' }}
                                        value={validUntil}
                                        onChange={(value) => setValidUntil(value)}
                                        disabledDate={(current) =>
                                            startDate ? current.isBefore(startDate.startOf('day')) : false
                                        }
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </>
                        )}
                    </Form>
                )}

                {currentStep === 2 && (
                    <Form layout="vertical">
                        <Form.Item label="Participants" required>
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder="Select groups"
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    const label: unknown = option?.children;
                                    return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase());
                                }}
                                style={{ width: '100%' }}
                                onChange={setSelectedParticipants}
                            >
                                {groups.map((g) => (
                                  <Select.Option key={g._id} value={g._id}>{g.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                )}
            </div>

            <div style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: currentStep === 0 ? 'flex-end' : 'space-between'
            }}>
                {currentStep > 0 && (
                    <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ccc',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <LeftOutlined />
                        Previous
                    </button>
                )}
                {currentStep < 2 ? (
                    <button
                        disabled={
                            (currentStep === 0 && (!startDate || !endDate || !subject || !classroom)) ||
                            (currentStep === 2 && selectedParticipants.length === 0)
                        }
                        onClick={() => setCurrentStep(currentStep + 1)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: (currentStep === 0 && (!startDate || !endDate || !subject || !classroom)) ||
                                (currentStep === 2 && selectedParticipants.length === 0) ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Next
                        <RightOutlined />
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={
                            !startDate ||
                            !endDate ||
                            !subject ||
                            !classroom ||
                            selectedParticipants.length === 0
                        }
                        onClick={() => {
                            const occasion: Occasion = {
                                occasion: null,
                                _id: '',
                                id: '',
                                dayId: startDate!.format('dddd'),
                                subjectId: subject!,
                                classroomId: classroom!,
                                teacherId: userData._id,
                                groupIds: selectedParticipants,
                                comments: '',
                                startTime: startDate!.format('HH:mm'),
                                endTime: endDate!.format('HH:mm'),
                                validFrom: startDate!.subtract(1, 'week').startOf('day').format('YYYY-MM-DDT00:00:00.000[Z]'),
                                validUntil: isRepetitionChecked && validUntil
                                  ? validUntil.endOf('day').format('YYYY-MM-DDT23:59:59.000[Z]')
                                  : startDate!.endOf('day').format('YYYY-MM-DDT23:59:59.000[Z]'),
                                repetition: isRepetitionChecked ? { interval: interval!, startingWeek: 1 } : undefined,
                                attendances: [],
                            };

                            createOccasion(occasion)
                              .then(async result => {
                                if (result) {
                                  await refreshUser();
                                  notification.success({
                                    message: 'Occasion Created',
                                    description: 'The occasion was created successfully.',
                                    placement: 'topRight'
                                  });
                                  onClose();
                                }
                              })
                              .catch(err => console.error('Error creating occasion:', err));
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#52c41a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity:
                                !startDate ||
                                    !endDate ||
                                    !subject ||
                                    !classroom ||
                                    selectedParticipants.length === 0
                                    ? 0.5
                                    : 1
                        }}
                    >
                        Create Occasion
                    </button>
                )}
            </div>
        </Modal>
    );
};

export default CreateOccasionModal;