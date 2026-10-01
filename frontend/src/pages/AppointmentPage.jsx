import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Icon = ({ type, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.8-3.4 3.2-5 7-5s6.2 1.6 7 5" />
      </>
    ),

    phone: (
      <>
        <path d="M6.5 3.5l3 1.2-1.5 3.4a13.2 13.2 0 0 0 7.4 7.4l3.4-1.5 1.2 3c.3.8-.1 1.7-.9 2.1-1 .5-2.2.8-3.3.5C9.8 18.1 5.9 14.2 4.4 8.2c-.3-1.1 0-2.3.5-3.3.4-.8 1.3-1.2 2.1-.9Z" />
      </>
    ),

    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M7 3v4M17 3v4M3.5 9h17" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.2 2" />
      </>
    ),

    doctor: (
      <>
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M9 4V2M15 4V2M12 14v3M8 21c.5-2.5 1.8-4 4-4s3.5 1.5 4 4" />
      </>
    ),

    chevron: <path d="m7 9 5 5 5-5" />,

    check: <path d="m5 12 4 4L19 6" />,

    alert: (
      <>
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
  };

  return <svg {...common}>{paths[type]}</svg>;
};

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const AppointmentPage = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [aptDate, setAptDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [aptTime, setAptTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [consent, setConsent] = useState(false);

  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);

  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  // Public appointment page:
  // No patient login or registration is required.
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch(`${API_URL}/appointments/doctors`);

        const data = await res.json().catch(() => []);

        if (!res.ok) {
          throw new Error(
            data?.error || 'Unable to load doctors.'
          );
        }

        const doctorList = Array.isArray(data)
          ? data.filter(
              (doctor) =>
                String(doctor.role || '').toLowerCase() === 'doctor'
            )
          : [];

        setDoctors(doctorList);
      } catch (error) {
        console.error('Doctors loading error:', error);

        setMessage({
          type: 'error',
          text: error.message || 'Unable to load doctors.',
        });
      }
    };

    loadDoctors();
  }, []);

  // Check availability whenever doctor/date/time changes.
  const checkAvailability = useCallback(async () => {
    if (!selectedDoctor || !aptDate || !aptTime) {
      setAvailability(null);
      return;
    }

    setChecking(true);
    setMessage(null);

    try {
      const url =
        `${API_URL}/appointments/availability` +
        `?doctor_id=${encodeURIComponent(selectedDoctor.id)}` +
        `&date=${encodeURIComponent(aptDate)}` +
        `&time=${encodeURIComponent(aptTime)}`;

      const res = await fetch(url);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setAvailability(null);

        setMessage({
          type: 'error',
          text:
            data?.error ||
            'Unable to check doctor availability.',
        });

        return;
      }

      setAvailability(data);
    } catch (error) {
      console.error('Availability error:', error);

      setAvailability(null);

      setMessage({
        type: 'error',
        text: 'Unable to check doctor availability.',
      });
    } finally {
      setChecking(false);
    }
  }, [selectedDoctor, aptDate, aptTime]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  // Submit appointment.
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);
    setSuccess(null);

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !selectedDoctor ||
      !aptDate ||
      !aptTime
    ) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required details.',
      });

      return;
    }

    if (availability?.available !== true) {
      setMessage({
        type: 'error',
        text:
          'The selected doctor is not available for this time slot.',
      });

      return;
    }

    if (!consent) {
      setMessage({
        type: 'error',
        text:
          'Please provide consent before requesting the appointment.',
      });

      return;
    }

    setBooking(true);

    try {
      const res = await fetch(
        `${API_URL}/appointments`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            patient_name: fullName.trim(),
            phone: phone.trim(),
            doctor_id: selectedDoctor.id,
            date: aptDate,
            time: aptTime,
            department:
              selectedDoctor.department ||
              'General Medicine',
            reason:
              symptoms.trim() ||
              'General checkup',
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({
          type: 'error',
          text:
            data?.error ||
            'Unable to book the appointment.',
        });

        return;
      }

      setSuccess(data);

      setMessage({
        type: 'success',
        text:
          'Appointment requested successfully.',
      });
    } catch (error) {
      console.error('Booking error:', error);

      setMessage({
        type: 'error',
        text:
          'Something went wrong. Please try again.',
      });
    } finally {
      setBooking(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setSelectedDoctor(null);

    setAptDate(
      new Date().toISOString().split('T')[0]
    );

    setAptTime('');
    setSymptoms('');
    setConsent(false);

    setAvailability(null);
    setMessage(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 px-4 py-8">
      <style>{`
        .appointment-shell {
          max-width: 760px;
          margin: 0 auto;
          background: rgba(255,255,255,0.96);
          border: 1px solid #e7edf2;
          border-radius: 26px;
          box-shadow: 0 18px 55px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .appointment-top-line {
          height: 5px;
          background: linear-gradient(90deg, #1595aa, #20b8aa);
        }

        .appointment-body {
          padding: 40px 42px 42px;
        }

        .field {
          position: relative;
          margin-bottom: 18px;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9aa5b1;
          pointer-events: none;
          display: flex;
        }

        .field select,
        .field input {
          padding-left: 50px;
          height: 62px;
          border-radius: 16px;
          border: 1px solid #e7ebef;
          background: #fbfcfd;
          color: #64748b;
          font-size: 16px;
          width: 100%;
          outline: none;
          box-sizing: border-box;
          transition: .2s;
        }

        .field select:focus,
        .field input:focus,
        .symptoms:focus {
          border-color: #9ccfd5;
          box-shadow: 0 0 0 3px rgba(32,184,170,.08);
          background: white;
        }

        .field select {
          appearance: auto;
        }

        .date-time-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .symptoms {
          width: 100%;
          min-height: 112px;
          resize: vertical;
          box-sizing: border-box;
          border: 1px solid #dfe5ea;
          border-radius: 16px;
          background: #fbfcfd;
          padding: 18px 20px;
          font-size: 16px;
          color: #475569;
          outline: none;
          font-family: inherit;
          margin-bottom: 20px;
        }

        .consent {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: #eff7ff;
          border: 1px solid #d7e7f4;
          border-radius: 16px;
          padding: 20px;
          color: #475569;
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .consent input {
          width: 23px;
          height: 23px;
          margin-top: 2px;
          flex-shrink: 0;
          accent-color: #1595aa;
        }

        .submit-btn {
          width: 100%;
          height: 60px;
          border: none;
          border-radius: 30px;
          color: white;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(90deg, #7bb9d8, #79d5c5);
          box-shadow: 0 8px 20px rgba(75, 170, 177, .18);
          transition: .2s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(75, 170, 177, .25);
        }

        .submit-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .message {
          border-radius: 12px;
          padding: 13px 16px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .message.error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
        }

        .message.success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
        }

        .doctor-box {
          margin: -4px 0 18px;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 14px 16px;
          background: #fafafa;
        }

        .doctor-box-title {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: .04em;
          margin-bottom: 8px;
        }

        .available {
          color: #059669;
          font-size: 12px;
          font-weight: 700;
        }

        .unavailable {
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
        }

        .success-card {
          text-align: center;
          padding: 28px 12px 8px;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ecfdf5;
          color: #059669;
        }

        .back-btn {
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 18px;
          padding: 0;
        }

        @media (max-width: 650px) {
          .appointment-body {
            padding: 28px 20px 30px;
          }

          .date-time-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .appointment-shell {
            border-radius: 18px;
          }
        }
      `}</style>

      <div className="appointment-shell">
        <div className="appointment-top-line" />

        <div className="appointment-body">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {!success ? (
            <>
              <h1 className="text-3xl font-bold text-slate-800 mb-8">
                Fill in your details
              </h1>

              {message && (
                <div
                  className={`message ${message.type}`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="field">
                  <span className="field-icon">
                    <Icon type="user" />
                  </span>

                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    required
                  />
                </div>

                {/* Phone */}
                <div className="field">
                  <span className="field-icon">
                    <Icon type="phone" />
                  </span>

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    required
                  />
                </div>

                {/* Doctor */}
                <div className="field">
                  <span className="field-icon">
                    <Icon type="doctor" />
                  </span>

                  <select
                    value={selectedDoctor?.id || ''}
                    onChange={(e) => {
                      const doctor =
                        doctors.find(
                          (d) =>
                            String(d.id) ===
                            e.target.value
                        );

                      setSelectedDoctor(
                        doctor || null
                      );

                      setAvailability(null);
                    }}
                    required
                  >
                    <option value="">
                      Choose Doctor
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.name}
                        {doctor.department
                          ? ` (${doctor.department})`
                          : ''}
                      </option>
                    ))}
                  </select>

                  <span
                    style={{
                      position: 'absolute',
                      right: 17,
                      top: '50%',
                      transform:
                        'translateY(-50%)',
                      color: '#94a3b8',
                      pointerEvents: 'none',
                    }}
                  >
                    <Icon
                      type="chevron"
                      size={18}
                    />
                  </span>
                </div>

                {/* Date and Time */}
                <div className="date-time-row">
                  <div className="field">
                    <span className="field-icon">
                      <Icon type="calendar" />
                    </span>

                    <input
                      type="date"
                      min={
                        new Date()
                          .toISOString()
                          .split('T')[0]
                      }
                      value={aptDate}
                      onChange={(e) =>
                        setAptDate(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="field">
                    <span className="field-icon">
                      <Icon type="clock" />
                    </span>

                    <select
                      value={aptTime}
                      onChange={(e) =>
                        setAptTime(
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">
                        Select Time
                      </option>

                      {timeSlots.map((time) => (
                        <option
                          key={time}
                          value={time}
                        >
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Availability */}
                {selectedDoctor &&
                  aptDate &&
                  aptTime && (
                    <div className="doctor-box">
                      <div className="doctor-box-title">
                        {checking
                          ? 'Checking doctor availability...'
                          : 'Doctor availability'}
                      </div>

                      {checking ? (
                        <div
                          style={{
                            color: '#64748b',
                            fontSize: 13,
                          }}
                        >
                          Checking{' '}
                          {selectedDoctor.name}
                          ...
                        </div>
                      ) : availability?.available ===
                        true ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'space-between',
                            gap: 12,
                          }}
                        >
                          <div>
                            <strong
                              style={{
                                color:
                                  '#334155',
                              }}
                            >
                              {selectedDoctor.name}
                            </strong>

                            <div
                              style={{
                                fontSize: 12,
                                color:
                                  '#94a3b8',
                                marginTop: 2,
                              }}
                            >
                              {selectedDoctor.department ||
                                'General Medicine'}
                            </div>
                          </div>

                          <span className="available">
                            ✓ Available
                          </span>
                        </div>
                      ) : availability ? (
                        <div>
                          <div className="unavailable">
                            ✗ Unavailable at{' '}
                            {aptTime}
                          </div>

                          {availability.suggested_time && (
                            <div
                              style={{
                                fontSize: 12,
                                color:
                                  '#92400e',
                                marginTop: 6,
                              }}
                            >
                              Suggested time:{' '}
                              {
                                availability.suggested_time
                              }
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                {/* Symptoms */}
                <textarea
                  className="symptoms"
                  placeholder="Describe your symptoms (optional)"
                  value={symptoms}
                  onChange={(e) =>
                    setSymptoms(
                      e.target.value
                    )
                  }
                />

                {/* Consent */}
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) =>
                      setConsent(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    I consent to the hospital
                    collecting and using my name,
                    contact number, and appointment
                    details only for the purpose of
                    booking and managing my appointment
                    with the doctor. I have read and
                    understood the{' '}
                    <strong
                      style={{
                        color: '#2563eb',
                      }}
                    >
                      Privacy Policy
                    </strong>{' '}
                    and I agree to it.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={booking}
                >
                  {booking
                    ? 'Requesting Appointment...'
                    : '➤  Request Appointment'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-card">
              <div className="success-icon">
                <Icon
                  type="check"
                  size={32}
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Appointment Confirmed!
              </h1>

              <p className="text-slate-500 mb-6">
                {success.patient_name ||
                  fullName}{' '}
                with{' '}
                {success.doctor_name ||
                  selectedDoctor?.name}{' '}
                on {aptDate} at {aptTime}.
              </p>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left mb-6">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Appointment ID
                </div>

                <div className="font-bold text-slate-700 break-all">
                  {success.id}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-full bg-slate-900 text-white py-3 font-semibold"
                >
                  Book Another
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 rounded-full border border-slate-300 bg-white text-slate-700 py-3 font-semibold"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
