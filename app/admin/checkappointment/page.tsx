// components/AppointmentReview.tsx
'use client';
import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

const AppointmentReview: React.FC<{ appointment: any }> = ({ appointment }) => {
  const [reason, setReason] = useState('');

  const handleAccept = async () => {
    try {
      const res = await fetch('/api/checkappointment/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: appointment.id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Appointment confirmed!');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const handleReject = async () => {
    if (!reason) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const res = await fetch('/api/checkappointment/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: appointment.id, reason }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Appointment rejected!');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  return (
    <Box>
      <h3>Appointment Details</h3>
      <p><strong>Patient Name:</strong> {appointment.familyFname} {appointment.familyLname}</p>
      <p><strong>Appointment Time:</strong> {appointment.date} at {appointment.time}</p>
      <p><strong>Status:</strong> {appointment.status}</p>

      {/* Options for accepting or rejecting */}
      {appointment.status === 'Pending' && (
        <Box>
          <Button variant="contained" color="primary" onClick={handleAccept}>
            Accept
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReject} sx={{ marginLeft: 2 }}>
            Reject
          </Button>

          {appointment.status === 'Rejected' && (
            <TextField
              label="Rejection Reason"
              multiline
              rows={4}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ marginTop: 2 }}
            />
          )}
        </Box>
      )}

      {/* Display "Cancelled" status */}
      {appointment.status === 'Cancelled' && (
        <p style={{ color: 'red' }}>This appointment has been cancelled.</p>
      )}
    </Box>
  );
};

export default AppointmentReview;
