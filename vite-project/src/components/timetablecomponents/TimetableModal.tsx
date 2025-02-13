/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Input, Select, Button, Row, Col } from 'antd';
import { useAuth } from '../../context/AuthContext'; // Assuming you have a context to get user info
import { Occasion } from '../../types/apitypes';
import { countOccurrences } from '../../utils/occasionUtils';
import useOccasions from '../../hooks/useOccasions'; // Import the hook
import { notification } from 'antd';

interface TimetableModalProps {
    isVisible: boolean;
    occasion: Occasion | null;
    selectedDate: Date | null; // Add selectedDate prop
    onClose: () => void;
}

const TimetableModal: React.FC<TimetableModalProps> = ({ isVisible, occasion, selectedDate, onClose }) => {
    const { userData } = useAuth();
    const { addCommentToOccasion } = useOccasions();
    const [commentType, setCommentType] = useState<'TEST' | 'COMMENT' | 'CANCELED'>('TEST');
    const [commentText, setCommentText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleCommentTypeChange = (value: 'TEST' | 'COMMENT' | 'CANCELED') => {
        setCommentType(value);
    };

    const handleCommentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    const handleSubmitComment = async () => {
        if (!userData || !occasion || !selectedDate || !commentText) return;

        setIsSubmitting(true);

        // Prepare the comment data
        const newComment = {
            type: commentType,
            comment: commentText,
            creatorId: userData.id, // Ensure creatorId is set
            activationDate: selectedDate.toISOString(), // Ensure the date format is correct
        };

        console.log('Preparing to submit comment:', newComment);

        try {
            await addCommentToOccasion(
                occasion._id,
                newComment.type,
                newComment.comment,
                newComment.activationDate,
                newComment.creatorId
            );

            notification.success({
                message: 'Comment Added',
                description: 'Your comment was successfully added to the occasion.',
                placement: 'topRight',
            });
            
        } catch (error) {
            console.error('Error while adding comment:', error);
        }

        setCommentType('TEST');
        setCommentText('');
        setIsSubmitting(false);
        onClose();
    };


    const formattedDate = selectedDate
        ? `${selectedDate.toLocaleDateString()} at ${selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : 'No date selected';

    // Calculate the occurrence label based on the selectedDate
    let occurrenceLabel = '';
    if (occasion && selectedDate) {
        occurrenceLabel = countOccurrences(occasion, selectedDate); // Assuming this function returns a string
    }

    return (
        <Modal
            title="Occasion Details"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {occasion ? (
                <Row gutter={16}>
                    {/* Left side: Occasion Details */}
                    <Col span={12}>
                        <div>
                            <p><strong>Occasion ID:</strong> {occasion._id}</p>
                            <p><strong>Scheduled on:</strong> {formattedDate}</p>

                            {/* Add more occasion data fields here */}
                            <p><strong>Subject:</strong> {occasion.subjectId}</p>
                            <p><strong>Classroom:</strong> {occasion.classroomId}</p>
                            <p><strong>Teacher:</strong> {occasion.teacherId.join(', ')}</p>

                            <p><strong>Occurrences:</strong> {occurrenceLabel}</p> {/* Display occurrence label */}
                        </div>
                    </Col>

                    {/* Right side: Add Comment */}
                    <Col span={12}>
                        <div style={{ paddingLeft: '20px' }}>
                            <h4>Add a Comment</h4>
                            <div style={{ marginBottom: '20px' }}>
                                <label>Comment Type: </label>
                                <Select value={commentType} onChange={handleCommentTypeChange} style={{ width: '100%' }}>
                                    <Select.Option value="TEST">Test</Select.Option>
                                    <Select.Option value="COMMENT">Comment</Select.Option>
                                    <Select.Option value="CANCELED">Canceled</Select.Option>
                                    {/* Add more types as needed */}
                                </Select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label>Comment: </label>
                                <Input.TextArea
                                    value={commentText}
                                    onChange={handleCommentTextChange}
                                    rows={4}
                                    placeholder="Enter your comment here"
                                />
                            </div>

                            <Button
                                type="primary"
                                onClick={handleSubmitComment}
                                loading={isSubmitting}
                                disabled={!commentText} // Disable if no comment text
                            >
                                Submit Comment
                            </Button>
                        </div>
                    </Col>
                </Row>
            ) : (
                <p>No occasion selected</p>
            )}
        </Modal>
    );
};

export default TimetableModal;