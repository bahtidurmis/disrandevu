import React, { useEffect, useState } from 'react';
import { doctorService, appointmentService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  available: boolean;
}

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [busyTimes, setBusyTimes] = useState<string[]>([]);
  const user = localStorage.getItem('user');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getDoctors();
        setDoctors(data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Doktorlar yüklenirken bir hata oluştu');
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && date) {
      fetch(`http://localhost:5000/api/appointments/doctor/${selectedDoctor._id}?date=${date}`)
        .then(r => r.json())
        .then(data => setBusyTimes(data.map((a: any) => a.time)));
    } else {
      setBusyTimes([]);
    }
  }, [selectedDoctor, date]);

  const handleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await appointmentService.createAppointment({
        userId: JSON.parse(user)._id,
        doctorId: selectedDoctor && selectedDoctor._id ? selectedDoctor._id : '',
        date: date,
        time: time,
      });
      setSuccess('Randevu başarıyla alındı!');
      setError('');
      setSelectedDoctor(null);
      setDate('');
      setTime('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Randevu alınamadı');
      setSuccess('');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Doktorlar</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        {doctors.map((doctor: Doctor) => (
          <div className="col-md-4" key={doctor._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{doctor.name}</h5>
                <p className="card-text">{doctor.specialty}</p>
                <button className="btn btn-primary" onClick={() => setSelectedDoctor(doctor)}>
                  Randevu Al
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Randevu Modalı */}
      {selectedDoctor && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{background: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Randevu Al - {selectedDoctor.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDoctor(null)}></button>
              </div>
              <form onSubmit={handleAppointment}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tarih</label>
                    <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Saat</label>
                    <select className="form-control" value={time} onChange={e => setTime(e.target.value)} required>
                      <option value="">Saat Seç</option>
                      {HOURS.map(h => (
                        <option key={h} value={h} disabled={busyTimes.includes(h)}>{h} {busyTimes.includes(h) ? '(Dolu)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedDoctor(null)}>Kapat</button>
                  <button type="submit" className="btn btn-primary">Randevu Al</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors; 