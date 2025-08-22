'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Users, DollarSign, Filter, Search, Edit, Trash2, Eye } from 'lucide-react'

interface TrainingPlan {
  id: string
  trainingName: string
  trainingType: string
  scheduleDate: string | null
  cost: number | null
  maxAttendees: number | null
  remarks: string | null
  status: string
  createdBy: string | null
  createdAt: string
}

interface NewTrainingPlan {
  trainingName: string
  trainingType: string
  scheduleDate: string
  cost: string
  maxAttendees: string
  remarks: string
  status: string
}

export default function TrainingPlanPage() {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([])
  const [showNewTrainingDialog, setShowNewTrainingDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')

  const [newTraining, setNewTraining] = useState<NewTrainingPlan>({
    trainingName: '',
    trainingType: 'Technical',
    scheduleDate: '',
    cost: '',
    maxAttendees: '',
    remarks: '',
    status: 'Planned'
  })

  const trainingTypes = [
    'Technical', 'Safety', 'Compliance', 'Software', 'Hardware', 
    'Security', 'Management', 'Communication', 'Project Management', 'Other'
  ]

  const statusOptions = ['Planned', 'Ongoing', 'Completed', 'Cancelled', 'Postponed']

  useEffect(() => {
    fetchTrainingPlans()
  }, [])

  const fetchTrainingPlans = async () => {
    try {
      const response = await fetch('/api/operations/training')
      if (response.ok) {
        const data = await response.json()
        setTrainingPlans(data)
      }
    } catch (error) {
      console.error('Failed to fetch training plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/operations/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTraining,
          cost: newTraining.cost ? parseFloat(newTraining.cost) : null,
          maxAttendees: newTraining.maxAttendees ? parseInt(newTraining.maxAttendees) : null,
          scheduleDate: newTraining.scheduleDate || null
        })
      })

      if (response.ok) {
        const createdTraining = await response.json()
        setTrainingPlans([createdTraining, ...trainingPlans])
        setShowNewTrainingDialog(false)
        setNewTraining({
          trainingName: '',
          trainingType: 'Technical',
          scheduleDate: '',
          cost: '',
          maxAttendees: '',
          remarks: '',
          status: 'Planned'
        })
      }
    } catch (error) {
      console.error('Failed to create training plan:', error)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/operations/training/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const updatedTraining = await response.json()
        setTrainingPlans(trainingPlans.map(t => 
          t.id === id ? updatedTraining : t
        ))
      }
    } catch (error) {
      console.error('Failed to update training status:', error)
    }
  }

  const filteredTrainings = trainingPlans.filter(training => {
    const matchesSearch = training.trainingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.trainingType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || training.status === filterStatus
    const matchesType = filterType === 'All' || training.trainingType === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-blue-100 text-blue-800'
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Postponed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technical': return 'bg-purple-100 text-purple-800'
      case 'Safety': return 'bg-red-100 text-red-800'
      case 'Compliance': return 'bg-orange-100 text-orange-800'
      case 'Security': return 'bg-red-100 text-red-800'
      case 'Management': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading training plans...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Training Plans</h1>
              <p className="text-gray-600">Manage and track training programs for your IT team</p>
            </div>
            <button
              onClick={() => setShowNewTrainingDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>New Training Plan</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planned</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {trainingPlans.filter(t => t.status === 'Planned').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {trainingPlans.filter(t => t.status === 'Ongoing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {trainingPlans.filter(t => t.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(trainingPlans.reduce((sum, t) => sum + (t.cost || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search training plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              {trainingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredTrainings.length} of {trainingPlans.length} trainings
            </div>
          </div>
        </div>

        {/* Training Plans List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees & Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrainings.map((training) => (
                  <tr key={training.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {training.trainingName}
                        </div>
                        {training.remarks && (
                          <div className="text-sm text-gray-500 mt-1">
                            {training.remarks}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(training.trainingType)}`}>
                          {training.trainingType}
                        </span>
                        <div>
                          <select
                            value={training.status}
                            onChange={(e) => handleUpdateStatus(training.id, e.target.value)}
                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(training.status)}`}
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(training.scheduleDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(training.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-4">
                          <div>
                            <Users className="h-4 w-4 inline mr-1" />
                            {training.maxAttendees || 'No limit'}
                          </div>
                          <div>
                            <DollarSign className="h-4 w-4 inline mr-1" />
                            {formatCurrency(training.cost)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTrainings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No training plans found</div>
              <p className="text-gray-400">Create your first training plan to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* New Training Dialog */}
      {showNewTrainingDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Training Plan</h3>
            
            <form onSubmit={handleCreateTraining} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTraining.trainingName}
                    onChange={(e) => setNewTraining({...newTraining, trainingName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cybersecurity Awareness"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Type
                  </label>
                  <select
                    value={newTraining.trainingType}
                    onChange={(e) => setNewTraining({...newTraining, trainingType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {trainingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newTraining.scheduleDate}
                    onChange={(e) => setNewTraining({...newTraining, scheduleDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newTraining.status}
                    onChange={(e) => setNewTraining({...newTraining, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTraining.maxAttendees}
                    onChange={(e) => setNewTraining({...newTraining, maxAttendees: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newTraining.cost}
                    onChange={(e) => setNewTraining({...newTraining, cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  rows={3}
                  value={newTraining.remarks}
                  onChange={(e) => setNewTraining({...newTraining, remarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this training..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTrainingDialog(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Training Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}