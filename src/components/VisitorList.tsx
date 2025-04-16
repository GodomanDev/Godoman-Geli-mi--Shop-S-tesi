import React, { useState } from 'react';
import { Shield, ShieldOff, X, AlertTriangle, Info, Trash2, RefreshCw } from 'lucide-react';
import { useVisitors, VisitorInfo } from '../contexts/VisitorContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const VisitorList: React.FC = () => {
  const { visitors, banVisitor, unbanVisitor, deleteVisitor, clearAllVisitors } = useVisitors();
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorInfo | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  const handleBanClick = async (ip: string, isBanned: boolean) => {
    const result = await Swal.fire({
      title: isBanned ? 'IP Yasağını Kaldır' : 'IP Yasakla',
      text: isBanned 
        ? `${ip} IP adresinin yasağını kaldırmak istediğinize emin misiniz?`
        : `${ip} IP adresini yasaklamak istediğinize emin misiniz?`,
      icon: isBanned ? 'warning' : 'error',
      showCancelButton: true,
      confirmButtonColor: isBanned ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isBanned ? 'Yasağı Kaldır' : 'Yasakla',
      cancelButtonText: 'İptal',
      background: '#1F2937',
      color: '#fff',
      customClass: {
        popup: 'rounded-lg border border-gray-700',
        title: 'text-xl font-bold',
        htmlContainer: 'text-gray-300',
        confirmButton: 'rounded-md',
        cancelButton: 'rounded-md'
      }
    });

    if (result.isConfirmed) {
      if (isBanned) {
        unbanVisitor(ip);
        toast.success('IP yasağı kaldırıldı!');
      } else {
        banVisitor(ip);
        toast.success('IP yasaklandı!');
      }
    }
  };

  const handleDeleteClick = async (ip: string) => {
    const result = await Swal.fire({
      title: 'IP Kaydını Sil',
      html: `<div class="flex flex-col items-center">
              <div class="text-red-500 mb-4">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <p class="text-gray-300">${ip} IP adresini silmek istediğinize emin misiniz?</p>
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
      deleteVisitor(ip);
      setSelectedVisitor(null);
      toast.success('IP kaydı silindi!');
    }
  };

  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: 'Tüm Kayıtları Sil',
      html: `<div class="flex flex-col items-center">
              <div class="text-red-500 mb-4">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <p class="text-gray-300">Tüm IP kayıtlarını silmek istediğinize emin misiniz?</p>
            </div>`,
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Evet, Hepsini Sil',
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
      clearAllVisitors();
      setSelectedVisitor(null);
      toast.success('Tüm IP kayıtları silindi!');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          Ziyaretçi Listesi
        </h3>
        <button
          onClick={handleClearAll}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tüm İPleri Temizle
        </button>
      </div>

      {selectedVisitor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Ziyaretçi Detayları</h3>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">IP Adresi:</span>
                <span className="text-white font-medium">{selectedVisitor.ip}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bölge:</span>
                <span className="text-white font-medium">{selectedVisitor.region || 'Bilinmiyor'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Şehir:</span>
                <span className="text-white font-medium">{selectedVisitor.city || 'Bilinmiyor'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Cihaz:</span>
                <span className="text-white font-medium">{selectedVisitor.device || 'Bilinmiyor'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tarayıcı:</span>
                <span className="text-white font-medium">{selectedVisitor.browser || 'Bilinmiyor'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">İşletim Sistemi:</span>
                <span className="text-white font-medium">{selectedVisitor.os || 'Bilinmiyor'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Son Ziyaret:</span>
                <span className="text-white font-medium">{formatDate(selectedVisitor.timestamp)}</span>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleBanClick(selectedVisitor.ip, selectedVisitor.banned)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors
                    ${selectedVisitor.banned
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                >
                  {selectedVisitor.banned ? (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Yasağı Kaldır
                    </>
                  ) : (
                    <>
                      <ShieldOff className="w-5 h-5 mr-2" />
                      IP'yi Yasakla
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteClick(selectedVisitor.ip)}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                IP Adresi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Son Ziyaret
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {visitors.map((visitor) => (
              <tr
                key={visitor.ip}
                className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => setSelectedVisitor(visitor)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{visitor.ip}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{formatDate(visitor.timestamp)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {visitor.banned ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Yasaklı
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Shield className="w-4 h-4 mr-1" />
                      Aktif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBanClick(visitor.ip, visitor.banned);
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors
                        ${visitor.banned
                          ? 'bg-green-600 hover:bg-green-500 text-white'
                          : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                    >
                      {visitor.banned ? (
                        <>
                          <Shield className="w-4 h-4 mr-1" />
                          Yasağı Kaldır
                        </>
                      ) : (
                        <>
                          <ShieldOff className="w-4 h-4 mr-1" />
                          Yasakla
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(visitor.ip);
                      }}
                      className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm font-medium transition-colors"
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

export default VisitorList;