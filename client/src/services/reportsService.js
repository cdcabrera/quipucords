import axios from 'axios';
import _get from 'lodash/get';
import moment from 'moment';
import serviceConfig from './config';

const getTimeStampFromResults = results => moment(_get(results, 'headers.date', Date.now())).format('YYYYMMDD_HHmmss');

const downloadCSV = (data = '', fileName = 'report.csv') =>
  new Promise((resolve, reject) => {
    try {
      const blob = new Blob([data], { type: 'text/csv' });

      if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName);
        resolve({ fileName, data });
      } else {
        const anchorTag = window.document.createElement('a');

        anchorTag.href = window.URL.createObjectURL(blob);
        anchorTag.style.display = 'none';
        anchorTag.download = fileName;

        window.document.body.appendChild(anchorTag);

        anchorTag.click();

        setTimeout(() => {
          window.document.body.removeChild(anchorTag);
          window.URL.revokeObjectURL(blob);
          resolve({ fileName, data });
        }, 250);
      }
    } catch (error) {
      reject(error);
    }
  });

const getReportDetails = (id, params = {}) =>
  axios(
    serviceConfig(
      {
        url: process.env.REACT_APP_REPORTS_SERVICE_DETAILS.replace('{0}', id),
        params
      },
      false
    )
  );

const getReportDetailsCsv = id =>
  getReportDetails(id, { format: 'csv' }).then(success =>
    downloadCSV(success.data, `report_${id}_details_${getTimeStampFromResults(success)}.csv`)
  );

const getReportSummary = (id, params = {}) =>
  axios(
    serviceConfig(
      {
        url: process.env.REACT_APP_REPORTS_SERVICE_DEPLOYMENTS.replace('{0}', id),
        params
      },
      false
    )
  );

const getReportSummaryCsv = (id, params = {}) =>
  getReportSummary(id, Object.assign(params, { format: 'csv' })).then(success =>
    downloadCSV(success.data, `report_${id}_summary_${getTimeStampFromResults(success)}.csv`)
  );

const getMergedScanReportDetailsCsv = id =>
  getReportDetails(id, { format: 'csv' }).then(success =>
    downloadCSV(success.data, `merged_report_details_${getTimeStampFromResults(success)}.csv`)
  );

const getMergedScanReportSummaryCsv = id =>
  getReportSummary(id, { format: 'csv' }).then(success =>
    downloadCSV(success.data, `merged_report_summary_${getTimeStampFromResults(success)}.csv`)
  );

const mergeScanReports = (data = {}) =>
  axios(
    serviceConfig({
      method: 'put',
      url: process.env.REACT_APP_REPORTS_SERVICE_MERGE,
      data
    })
  );

const reportsService = {
  getReportDetails,
  getReportDetailsCsv,
  getReportSummary,
  getReportSummaryCsv,
  getMergedScanReportDetailsCsv,
  getMergedScanReportSummaryCsv,
  mergeScanReports
};

export {
  reportsService as default,
  reportsService,
  getReportDetails,
  getReportDetailsCsv,
  getReportSummary,
  getReportSummaryCsv,
  getMergedScanReportDetailsCsv,
  getMergedScanReportSummaryCsv,
  mergeScanReports
};
