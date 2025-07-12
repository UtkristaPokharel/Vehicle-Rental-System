import { useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";


const orders = [
    {
      id: '#2632',
      customer: 'Brooklyn Zoe',
      avatar: '👤',
      payment: 'Cash',
      timeRemaining: '13 min',
      type: 'Delivery',
      status: 'Delivered',
      statusColor: 'bg-orange-100 text-orange-600',
      total: '£12.00'
    },
    {
      id: '#2632',
      customer: 'Alice Krejčová',
      avatar: '👤',
      payment: 'Paid',
      timeRemaining: '49 min',
      type: 'Collection',
      status: 'Collected',
      statusColor: 'bg-green-100 text-green-600',
      total: '£14.00'
    },
    {
      id: '#2632',
      customer: 'Jurriaan van',
      avatar: '👤',
      payment: 'Cash',
      timeRemaining: '07 min',
      type: 'Delivery',
      status: 'Cancelled',
      statusColor: 'bg-red-100 text-red-600',
      total: '£18.00'
    },
    {
      id: '#2632',
      customer: 'Ya Chin-Ho',
      avatar: '👤',
      payment: 'Paid',
      timeRemaining: '49 min',
      type: 'Collection',
      status: 'Collected',
      statusColor: 'bg-green-100 text-green-600',
      total: '£26.00'
    },
    {
      id: '#2632',
      customer: 'Shaamikh Al',
      avatar: '👤',
      payment: 'Cash',
      timeRemaining: '13 min',
      type: 'Delivery',
      status: 'Delivered',
      statusColor: 'bg-orange-100 text-orange-600',
      total: '£08.00'
    },
    {
      id: '#2632',
      customer: 'Niek Bove',
      avatar: '👤',
      payment: 'Paid',
      timeRemaining: '00 min',
      type: 'Collection',
      status: 'Cancelled',
      statusColor: 'bg-red-100 text-red-600',
      total: '£15.00'
    },
    {
      id: '#2632',
      customer: 'Uruewa Himana',
      avatar: '👤',
      payment: 'Cash',
      timeRemaining: '15 min',
      type: 'Delivery',
      status: 'Delivered',
      statusColor: 'bg-orange-100 text-orange-600',
      total: '£19.00'
    }
  ];




export default function DashboardComponent({ vehicleId, createdBy, price, type  }) {
      const [showDropdown, setShowDropdown] = useState(null);


    return(
        <>
         <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-medium text-gray-500 border-b">
                      <th className="pb-3 px-4">{vehicleId}</th>
                      <th className="pb-3 px-4">{createdBy}</th>
                      <th className="pb-3 px-4">{type}</th>
                      <th className="pb-3 px-4">Type</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">{price}</th>
                    <th className="pb-3 px-4">Action</th>


                 
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-100 ">
                        <td className="py-4 px-4 text-sm text-gray-600">{order.id}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs">👤</span>
                            </div>
                            <span className="text-sm font-medium text-gray-800">{order.customer}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{order.payment}</td>
                        <td className="py-4 px-4">
                          <span className={`text-sm ${order.type === 'Delivery' ? 'text-red-600' : 'text-gray-600'}`}>
                            {order.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${
                              order.status === 'Delivered' ? 'bg-orange-500' : 
                              order.status === 'Collected' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-800">{order.total}</td>
                         <td className="py-4 px-4">
                          <div className="relative">
                            <button
                              onClick={() => setShowDropdown(showDropdown === index ? null : index)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                                <BsThreeDotsVertical className="text-gray-600" />   
                            </button>
                            
                            {showDropdown === index && (
                              <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                  Refund
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                                  Message
                                </button>
                              </div>
                            )}
                          </div>
                        </td>


                      </tr>

                    ))}
                  </tbody>
                </table>
              </div>
        </>
    )

}