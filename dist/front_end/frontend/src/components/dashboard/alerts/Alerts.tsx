import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Alert {
  topic: string;
  message: string;
  color: string;
}


interface AlertsProps {
    alerts: any[] ;
}

export default function Alerts(props : AlertsProps) {


  const [currentAlertIndex, setCurrentAlertIndex] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {

    if (currentAlertIndex < props.alerts!.length) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setTimeout(() => {
          setCurrentAlertIndex(currentAlertIndex + 1);
        }, 1000); // Hide alert for 1 second before showing the next one
      }, 2000); // Show alert for 1 second

      return () => clearTimeout(timer);
    }
  }, [currentAlertIndex ,props.alerts]);

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '200px', // Adjust width to make it more square-like
    zIndex: 1050, // Ensure it appears on top of everything
  };

  return (
    <div className="container mt-5">
      {showAlert && (
        <div className={'alert '+props.alerts![currentAlertIndex].color} role="alert" style={toastStyle}>
          <div className="toast-header">
            <strong className="mr-auto">{props.alerts![currentAlertIndex].topic}</strong>
          </div>
          <div className="toast-body">
            {props.alerts![currentAlertIndex].message}
          </div>
        </div>
      )}
    </div>
  );
}

