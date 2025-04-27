import { useState } from 'react';
import './DepartmentManager.css';
import DepartmentForm from './DepartmentForm';
import ActionButton from '../Common/ActionButton';

function DepartmentManager({ departments = [], onAdd, onEdit, onDelete }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const handleAddClick = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setShowConfirmation(true);
  };

  const handleFormSubmit = (department) => {
    if (editingDepartment) {
      onEdit(department);
    } else {
      onAdd(department);
    }
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(departmentToDelete.id);
    setShowConfirmation(false);
    setDepartmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDepartmentToDelete(null);
  };

  return (
    <div className="department-manager-container">
      <div className="department-header">
        <h1 className="department-title">Departments</h1>
        <ActionButton
          text="Add Department"
          type="primary"
          onClick={handleAddClick}
        />
      </div>

      {departments.length === 0 ? (
        <div className="empty-state">
          <p>No departments found. Click "Add Department" to create one.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="departments-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.description}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <ActionButton
                        text="Edit"
                        type="secondary"
                        onClick={() => handleEditClick(department)}
                      />
                      <ActionButton
                        text="Delete"
                        type="danger"
                        onClick={() => handleDeleteClick(department)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <DepartmentForm
          department={editingDepartment}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Delete Department</h3>
            <p>
              Are you sure you want to delete the department 
              <strong> {departmentToDelete.name}</strong>?
            </p>
            <div className="confirmation-actions">
              <ActionButton
                text="Cancel"
                type="secondary"
                onClick={handleCancelDelete}
              />
              <ActionButton
                text="Delete"
                type="danger"
                onClick={handleConfirmDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentManager;