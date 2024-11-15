import React, { useState } from 'react';
import { Modal, Button, Select, Input } from 'antd';
import { Occasion, Subject } from '../types/apitypes';
import { UserType } from '../enums/UserType';
import { useAuth } from '../context/AuthContext';
import { addCommentToOccasion } from '../api';

const { Option } = Select;

interface TimetableModalProps {
    isVisible: boolean;
    selectedOccasion: Occasion | null;
    selectedDate: Date | null;
    subjects: Subject[];
    onClose: () => void;
    refreshData?: () => void; // Optional callback to refresh parent data
}

const TimetableModal: React.FC<TimetableModalProps> = ({
    isVisible,
    selectedOccasion,
    selectedDate,
    subjects,
    onClose,
    refreshData,
}) => {
    const { userData } = useAuth();

    const [commentType, setCommentType] = useState<'TEST' | 'COMMENT' | 'FREE'>('COMMENT');
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async () => {
        if (selectedOccasion && comment.trim() && selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const { _id, dayId, timeId } = selectedOccasion;
            try {
                await addCommentToOccasion(_id, dayId, timeId, commentType, comment, formattedDate);
                setComment('');
                if (refreshData) refreshData();
                onClose();
            } catch (error) {
                console.error('Failed to add comment:', error);
            }
        }
    };

    return (
        <Modal
            title="Class Details"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
        >
            {selectedOccasion && (
                <div>
                    <p>
                        <strong>Date:</strong>{' '}
                        {selectedDate
                            ? `${selectedDate.toLocaleString('default', {
                                  month: 'short',
                              })} ${selectedDate.getDate()}`
                            : ''}
                    </p>
                    <p>
                        <strong>Subject Name:</strong>{' '}
                        {
                            subjects.find(
                                (s) =>
                                    s.timetableId.toString() === selectedOccasion.subjectId.toString()
                            )?.name || 'Unknown Subject'
                        }
                    </p>
                    <p>
                        <strong>ID:</strong> {selectedOccasion.id}
                    </p>
                    <p>
                        <strong>Classroom ID(s):</strong>{' '}
                        {selectedOccasion.classroomId.join(', ')}
                    </p>
                    <p>
                        <strong>Teacher ID(s):</strong>{' '}
                        {selectedOccasion.teacherId.join(', ')}
                    </p>
                    <p>
                        <strong>Group ID(s):</strong>{' '}
                        {selectedOccasion.groupIds.join(', ')}
                    </p>
                    <p>
                        <strong>Day ID:</strong> {selectedOccasion.dayId}
                    </p>
                    <p>
                        <strong>Time ID:</strong> {selectedOccasion.timeId}
                    </p>

                    <div style={{ marginTop: 20 }}>
                        <h4>Comments:</h4>
                        {selectedOccasion.comments && selectedOccasion.comments.length > 0 ? (
                            <ul>
                                {selectedOccasion.comments.map((comment, index) => (
                                    <li key={index}>
                                        <strong>{comment.type}:</strong> {comment.comment}{' '}
                                        <em>
                                            (Day ID: {comment.dayId}, Time ID: {comment.timeId}),
                                            Activation Date: {comment.activationDate}
                                        </em>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No comments available for this occasion.</p>
                        )}
                    </div>

                    {userData?.type === UserType.TEACHER && (
                        <div style={{ marginTop: 20 }}>
                            <Select
                                value={commentType}
                                onChange={(value) => setCommentType(value)}
                                style={{ width: '100%', marginBottom: 10 }}
                            >
                                <Option value="COMMENT">Comment</Option>
                                <Option value="TEST">Test</Option>
                                <Option value="FREE">Free</Option>
                            </Select>
                            <Input.TextArea
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add your comment here..."
                            />
                            <Button
                                type="primary"
                                onClick={handleCommentSubmit}
                                style={{ marginTop: 10 }}
                            >
                                Submit Comment
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default TimetableModal;