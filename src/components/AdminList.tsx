import React, { useState } from 'react';
import { Eye, EyeOff, Edit2, Trash2, Shield, ShieldOff, RefreshCw, X, Wand2 } from 'lucide-react';
import { useAdmins, AdminUser } from '../contexts/AdminContext';
import { generatePassword } from '../utils/passwordGenerator';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminList: React.FC = () => {
  const { admins, addAdmin, updateAdmin, deleteAdmin, toggleAdminStatus, toggleMultiLogin } = useAdmins();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    multiLogin: false,
    showPassword: false
  });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.password) {
      toast.error('Kullanıcı adı ve şifre gerekli!');
      return;
    }

    addAdmin(newAdmin.username, newAdmin.password, newAdmin.multiLogin);
    setShowAddForm(false);
    setNewAdmin({ username: '', password: '', multiLogin: false, showPassword: false });
    toast.success('Admin başarıyla eklendi!');
  };

  const generateRandomPassword = () => {
    const password = generatePassword(16);
    setNewAdmin({ ...newAdmin, password });
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    const result = await Swal.fire({
      title: 'Admin Kullanıcıyı Sil',
      html: `<div class="flex flex-col items-center">
              <div class="text-red-500 mb-4">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <p class="text-gray-300">${admin.username} kullanıcısını silmek istediğinize emin misiniz?</p>
            </div>`,
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      background: '#1F2937',
      color: '#fff',
      customClass: {
        popup: 'rounded-lg border border-gray-700',
        title: 'text-xl font-bold',
        confirmButton: 'rounded-md',
        cancelButton: 'rounded-md'
      }
    });

    if (result.isConfirmed) {
      deleteAdmin(admin.id);
      setSelectedAdmin(null);
      toast.success('Admin başarıyla silindi!');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    if (!editForm.username || !editForm.password) {
      toast.error('Kullanıcı adı ve şifre gerekli!');
      return;
    }

    const updatedAdmin = {
      ...selectedAdmin,
      username: editForm.username,
      password: editForm.password
    };

    updateAdmin(updatedAdmin);
    setEditMode(false);
    toast.success('Admin bilgileri güncellendi!');
  };

  const handleAdminClick = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setEditForm({
      username: admin.username,
      password: admin.password,
      showPassword: false
    });
    setEditMode(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-400" />
          Admin Kullanıcılar
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Admin Ekle
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Yeni Admin Ekle</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Kullanıcı adı girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Şifre
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type={newAdmin.showPassword ? 'text' : 'password'}
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white pr-10"
                      placeholder="Şifre girin"
                    />
                    <button
                      type="button"
                      onClick={() => setNewAdmin({ ...newAdmin, showPassword: !newAdmin.showPassword })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {newAdmin.showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 flex items-center"
                  >
                    <Wand2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        newAdmin.password.length === 0 ? 'w-0 bg-red-500' :
                        newAdmin.password.length < 8 ? 'w-1/4 bg-red-500' :
                        newAdmin.password.length < 12 ? 'w-1/2 bg-yellow-500' :
                        newAdmin.password.length < 16 ? 'w-3/4 bg-blue-500' :
                        'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {newAdmin.password.length === 0 ? 'Şifre giriniz' :
                     newAdmin.password.length < 8 ? 'Zayıf şifre' :
                     newAdmin.password.length < 12 ? 'Orta seviye şifre' :
                     newAdmin.password.length < 16 ? 'İyi şifre' :
                     'Güçlü şifre'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="multiLogin"
                  checked={newAdmin.multiLogin}
                  onChange={(e) => setNewAdmin({ ...newAdmin, multiLogin: e.target.checked })}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="multiLogin" className="text-sm text-gray-300">
                  Çoklu giriş izni
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Admin Detayları</h3>
              <button
                onClick={() => {
                  setSelectedAdmin(null);
                  setEditMode(false);
                }}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={editForm.showPassword ? 'text' : 'password'}
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, showPassword: !editForm.showPassword })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {editForm.showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    Güncelle
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Kullanıcı Adı:</span>
                  <span className="text-white font-medium">{selectedAdmin.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Şifre:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium font-mono">
                      {showPasswords[selectedAdmin.id] ? selectedAdmin.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => setShowPasswords({
                        ...showPasswords,
                        [selectedAdmin.id]: !showPasswords[selectedAdmin.id]
                      })}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      {showPasswords[selectedAdmin.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Son Giriş IP:</span>
                  <span className="text-white font-medium">{selectedAdmin.lastLoginIp || 'Henüz giriş yapılmadı'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Durum:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${selectedAdmin.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {selectedAdmin.active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Multi-Login:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${selectedAdmin.multiLogin
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'}`}
                  >
                    {selectedAdmin.multiLogin ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(selectedAdmin)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Kullanıcı Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Şifre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {admins.map((admin) => (
              <tr 
                key={admin.id} 
                className="hover:bg-gray-700/30 cursor-pointer"
                onClick={() => handleAdminClick(admin)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{admin.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300 font-mono">
                      {showPasswords[admin.id] ? admin.password : '••••••••'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPasswords({
                          ...showPasswords,
                          [admin.id]: !showPasswords[admin.id]
                        });
                      }}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      {showPasswords[admin.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${admin.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'}`}
                    >
                      {admin.active ? 'Aktif' : 'Pasif'}
                    </span>
                    {admin.multiLogin && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Multi
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAdminStatus(admin.id);
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium
                        ${admin.active
                          ? 'bg-red-600 hover:bg-red-500'
                          : 'bg-green-600 hover:bg-green-500'} text-white`}
                    >
                      {admin.active ? (
                        <>
                          <ShieldOff className="w-4 h-4 mr-1" />
                          Devre Dışı Bırak
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-1" />
                          Etkinleştir
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMultiLogin(admin.id);
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium
                        ${admin.multiLogin
                          ? 'bg-yellow-600 hover:bg-yellow-500'
                          : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                    >
                      {admin.multiLogin ? 'Multi Kapat' : 'Multi Aç'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAdmin(admin);
                      }}
                      className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;