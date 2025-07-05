import React, { useEffect, useState } from 'react';
import { doctorService, appointmentService } from '../services/api';

const HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const Admin: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rUserId, setRUserId] = useState('');
  const [rDoctorId, setRDoctorId] = useState('');
  const [rDate, setRDate] = useState('');
  const [rTime, setRTime] = useState('');
  const [busyTimes, setBusyTimes] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState('');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editBusyTimes, setEditBusyTimes] = useState<string[]>([]);
  const user = localStorage.getItem('user');
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    doctorService.getDoctors().then(setDoctors);
    fetch(`${API_URL}/appointments/all`).then(r=>r.json()).then(data => setAppointments(Array.isArray(data) ? data : [])).catch(()=>setAppointments([]));
  }, []);

  useEffect(() => {
    if (rDoctorId && rDate) {
      fetch(`${API_URL}/appointments/doctor/${rDoctorId}?date=${rDate}`)
        .then(r => r.json())
        .then(data => setBusyTimes(data.map((a: any) => a.time)));
    } else {
      setBusyTimes([]);
    }
  }, [rDoctorId, rDate]);

  useEffect(() => {
    if (editDoctorId && editDate) {
      fetch(`${API_URL}/appointments/doctor/${editDoctorId}?date=${editDate}`)
        .then(r => r.json())
        .then(data => setEditBusyTimes(data.map((a: any) => a.time)));
    } else {
      setEditBusyTimes([]);
    }
  }, [editDoctorId, editDate]);

  if (!user || JSON.parse(user).email !== 'admin@admin.com') {
    return <div className="container py-5">Yetkisiz erişim.</div>;
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorService.addDoctor({ name, specialty, available: true });
      setDoctors(await doctorService.getDoctors());
      setName(''); setSpecialty('');
      setSuccess('Doktor eklendi!');
    } catch {
      setError('Doktor eklenemedi');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    try {
      await fetch(`${API_URL}/doctors/${id}`, { method: 'DELETE' });
      setDoctors(await doctorService.getDoctors());
    } catch {
      setError('Doktor silinemedi');
    }
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await appointmentService.createAppointment({
        userId: rUserId,
        doctorId: rDoctorId,
        date: rDate,
        time: rTime,
      });
      fetch(`${API_URL}/appointments/all`).then(r=>r.json()).then(data => setAppointments(Array.isArray(data) ? data : [])).catch(()=>setAppointments([]));
      setRUserId(''); setRDoctorId(''); setRDate(''); setRTime('');
      setSuccess('Randevu eklendi!');
    } catch {
      setError('Randevu eklenemedi');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
      fetch(`${API_URL}/appointments/all`).then(r=>r.json()).then(data => setAppointments(Array.isArray(data) ? data : [])).catch(()=>setAppointments([]));
    } catch {
      setError('Randevu silinemedi');
    }
  };

  const handleEdit = (a: any) => {
    setEditId(a._id);
    setEditUserId(a.userId?._id || a.userId || '');
    setEditDoctorId(a.doctorId?._id || a.doctorId || '');
    setEditDate(a.date ? a.date.slice(0, 10) : '');
    setEditTime(a.time);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/appointments/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editUserId,
          doctorId: editDoctorId,
          date: editDate,
          time: editTime,
        })
      });
      setEditId(null);
      fetch(`${API_URL}/appointments/all`).then(r=>r.json()).then(data => setAppointments(Array.isArray(data) ? data : [])).catch(()=>setAppointments([]));
      setSuccess('Randevu güncellendi!');
    } catch {
      setError('Randevu güncellenemedi');
    }
  };

  return (
    <div className="container py-5">
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Doktorlar</h3>
      <form className="row g-2 mb-3" onSubmit={handleAddDoctor}>
        <div className="col-md-4">
          <input className="form-control" placeholder="Doktor Adı" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Uzmanlık" value={specialty} onChange={e=>setSpecialty(e.target.value)} required />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" type="submit">Ekle</button>
        </div>
      </form>
      <ul className="list-group mb-4">
        {doctors.map((d: any) => (
          <li key={d._id} className="list-group-item d-flex justify-content-between align-items-center">
            {d.name} - {d.specialty}
            <button className="btn btn-danger btn-sm" onClick={()=>handleDeleteDoctor(d._id)}>Sil</button>
          </li>
        ))}
      </ul>
      <h3>Randevular</h3>
      <form className="row g-2 mb-3" onSubmit={handleAddAppointment}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Kullanıcı ID" value={rUserId} onChange={e=>setRUserId(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <select className="form-control" value={rDoctorId} onChange={e=>setRDoctorId(e.target.value)} required>
            <option value="">Doktor Seç</option>
            {doctors.map((d: any) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" type="date" value={rDate} onChange={e=>setRDate(e.target.value)} required />
        </div>
        <div className="col-md-2">
          <select className="form-control" value={rTime} onChange={e=>setRTime(e.target.value)} required>
            <option value="">Saat Seç</option>
            {HOURS.map(h => (
              <option key={h} value={h} disabled={busyTimes.includes(h)}>{h} {busyTimes.includes(h) ? '(Dolu)' : ''}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">Ekle</button>
        </div>
      </form>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Kullanıcı</th>
            <th>Doktor</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            editId === a._id ? (
              <tr key={i}>
                <td><input className="form-control" value={editUserId} onChange={e=>setEditUserId(e.target.value)} /></td>
                <td>
                  <select className="form-control" value={editDoctorId} onChange={e=>setEditDoctorId(e.target.value)} required>
                    <option value="">Doktor Seç</option>
                    {doctors.map((d: any) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </td>
                <td><input className="form-control" type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} /></td>
                <td>
                  <select className="form-control" value={editTime} onChange={e=>setEditTime(e.target.value)} required>
                    <option value="">Saat Seç</option>
                    {HOURS.map(h => (
                      <option key={h} value={h} disabled={editBusyTimes.includes(h) && h !== a.time}>{h} {editBusyTimes.includes(h) && h !== a.time ? '(Dolu)' : ''}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={handleEditSave}
                    style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}
                  >Kaydet</button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={()=>setEditId(null)}
                    style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                  >Vazgeç</button>
                </td>
              </tr>
            ) : (
              <tr key={i}>
                <td>{a.userId?.email || a.userId || '-'}</td>
                <td>{a.doctorId?.name || '-'}</td>
                <td>{a.date ? a.date : '-'}</td>
                <td>{a.time}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={()=>handleEdit(a)}
                    style={{ background: '#2563eb', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}
                  >Düzenle</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>handleDeleteAppointment(a._id)}>Sil</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin; 