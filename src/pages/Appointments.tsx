import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/api';

const HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [editAppointment, setEditAppointment] = useState<any>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editBusyTimes, setEditBusyTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = localStorage.getItem('user');
  const API_URL = '/api';

  useEffect(() => {
    if (!user) return;
    const userId = JSON.parse(user)._id;
    appointmentService.getUserAppointments(userId)
      .then(setAppointments)
      .catch(() => setError('Randevular yüklenemedi'))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (editAppointment && editDate) {
      fetch(`${API_URL}/appointments/doctor/${editAppointment.doctorId?._id || editAppointment.doctorId}?date=${editDate}`)
        .then(r => r.json())
        .then(data => setEditBusyTimes(data.map((a: any) => a.time)));
    } else {
      setEditBusyTimes([]);
    }
  }, [editAppointment, editDate]);

  const handleEdit = (appointment: any) => {
    setEditAppointment(appointment);
    setEditDate(appointment.date);
    setEditTime(appointment.time);
  };

  const handleSave = async () => {
    if (editAppointment) {
      const updatedAppointment = { ...editAppointment, date: editDate, time: editTime };
      await appointmentService.updateAppointment(editAppointment._id, updatedAppointment);
      setAppointments(appointments.map(a => a._id === editAppointment._id ? updatedAppointment : a));
      setEditAppointment(null);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
    if (!user) return;
    const userId = JSON.parse(user)._id;
    appointmentService.getUserAppointments(userId)
      .then(setAppointments)
      .catch(() => setError('Randevular yüklenemedi'));
  };

  if (!user) return <div className="container py-5">Randevularınızı görüntülemek için giriş yapmalısınız.</div>;
  if (loading) return <div className="container py-5">Yükleniyor...</div>;
  if (error) return <div className="container py-5 text-danger">{error}</div>;

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 700, fontSize: '2.2rem' }}>Randevularım</h1>
      <div className="card shadow" style={{ width: '100%', maxWidth: 700, padding: 0 }}>
        <table className="table table-striped" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Doktor</th>
              <th style={{ textAlign: 'center' }}>Tarih</th>
              <th style={{ textAlign: 'center' }}>Saat</th>
              <th style={{ textAlign: 'center' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id}>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{a.doctorId?.name || '-'}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{a.date}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{a.time}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <button
                    onClick={() => handleEdit(a)}
                    style={{
                      background: '#2563eb', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', marginRight: '0.5rem'
                    }}
                  >Düzenle</button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    style={{
                      background: '#dc2626', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer'
                    }}
                  >Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Randevu Düzenle</h2>
            <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="border p-2 mb-2" />
            <select value={editTime} onChange={e => setEditTime(e.target.value)} className="border p-2 mb-2 w-full">
              <option value="">Saat Seç</option>
              {HOURS.map(h => (
                <option key={h} value={h} disabled={editBusyTimes.includes(h) && h !== editAppointment.time}>{h} {editBusyTimes.includes(h) && h !== editAppointment.time ? '(Dolu)' : ''}</option>
              ))}
            </select>
            <button
              onClick={handleSave}
              style={{
                background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', marginRight: '0.5rem'
              }}
            >Kaydet</button>
            <button
              onClick={() => setEditAppointment(null)}
              style={{
                background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer'
              }}
            >İptal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments; 