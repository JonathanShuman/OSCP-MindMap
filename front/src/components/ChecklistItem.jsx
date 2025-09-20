import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ChecklistItem = ({ 
  item, 
  isChecked, 
  notes, 
  onCheckboxChange, 
  onNotesChange,
  onHelperChange 
}) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const toggleNotesExpanded = () => {
    setIsNotesExpanded(prev => !prev);
  };

  const handleCopyCommand = (command) => {
    navigator.clipboard.writeText(command);
  };

  return (
    <div className="checklist-item">
      <div className="checklist-header">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
            className="checkbox"
          />
          <span className={`item-name ${isChecked ? 'checked' : ''}`}>
            {item.name}
          </span>
        </label>
        <button
          onClick={toggleNotesExpanded}
          className="expand-button"
        >
          {isNotesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isNotesExpanded && (
        <div className="expanded-section">
          <div className="helper-section">
            <h4>Helper Content:</h4>
            <textarea
              value={item.helper.content || ''}
              onChange={(e) => onHelperChange(item.id, e.target.value)}
              className="helper-textarea"
              rows="6"
            />
          </div>
          <div className="notes-section">
            <h4>Your Notes:</h4>
            <textarea
              placeholder="Add your notes, findings, or observations here..."
              value={notes}
              onChange={(e) => onNotesChange(item.id, e.target.value)}
              className="notes-textarea"
              rows="4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;