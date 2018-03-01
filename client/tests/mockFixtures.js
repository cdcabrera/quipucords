// ToDo: this file should be generated from the Swagger spec definitions, to be used towards integration
// Credentials
const postCredentials = {
  name: 'string',
  cred_type: 'network',
  username: 'string',
  password: 'string',
  ssh_keyfile: 'string',
  become_method: 'sudo',
  become_user: 'string',
  become_password: 'string',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ]
};

const postCredentialsResponse = {
  name: 'string',
  cred_type: 'network',
  username: 'string',
  password: 'string',
  ssh_keyfile: 'string',
  become_method: 'sudo',
  become_user: 'string',
  become_password: 'string',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  id: 0
};

const getCredentials = {
  count: 0,
  next: 'string',
  previous: 'string',
  results: [
    {
      name: 'string',
      cred_type: 'network',
      username: 'string',
      password: 'string',
      ssh_keyfile: 'string',
      become_method: 'sudo',
      become_user: 'string',
      become_password: 'string',
      sources: [
        {
          id: 0,
          name: 'string',
          source_type: 'network'
        }
      ],
      id: 0
    }
  ]
};

const getCredential = {
  name: 'string',
  cred_type: 'network',
  username: 'string',
  password: 'string',
  ssh_keyfile: 'string',
  become_method: 'sudo',
  become_user: 'string',
  become_password: 'string',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  id: 0
};

const putCredential = {
  name: 'string',
  cred_type: 'network',
  username: 'string',
  password: 'string',
  ssh_keyfile: 'string',
  become_method: 'sudo',
  become_user: 'string',
  become_password: 'string',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ]
};

const putCredentialResponse = {
  name: 'string',
  cred_type: 'network',
  username: 'string',
  password: 'string',
  ssh_keyfile: 'string',
  become_method: 'sudo',
  become_user: 'string',
  become_password: 'string',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  id: 0
};

const deleteCredential = {};

const deleteCredentialResponse = {};

const credentialsMock = {
  postCredentials,
  postCredentialsResponse,
  getCredentials,
  getCredential,
  putCredential,
  putCredentialResponse,
  deleteCredential,
  deleteCredentialResponse
};

// Facts
const postFacts = {
  sources: [
    {
      source_id: 12,
      source_type: 'network',
      facts: [
        {
          etc_release_name: 'Red Hat Enterprise Linux Server',
          etc_release_release: 'Red Hat Enterprise Linux Server release 6.7 (Santiago)',
          etc_release_version: '6.7',
          connection_uuid: 'abc7f26f-1234-57bd-85d8-de7617123456'
        }
      ]
    }
  ]
};

const postFactsResponse = {
  id: 15,
  facts: [
    {
      source_id: 12,
      source_type: 'network',
      facts: [
        {
          etc_release_name: 'Red Hat Enterprise Linux Server',
          etc_release_release: 'Red Hat Enterprise Linux Server release 6.7 (Santiago)',
          etc_release_version: '6.7',
          connection_uuid: 'abc7f26f-1234-57bd-85d8-de7617123456'
        }
      ]
    }
  ]
};

const factsMock = {
  postFacts,
  postFactsResponse
};

// Reports
const getReportDetail = {
  source_id: 12,
  source_type: 'network',
  facts: [
    {
      etc_release_name: 'Red Hat Enterprise Linux Server',
      etc_release_release: 'Red Hat Enterprise Linux Server release 6.7 (Santiago)',
      etc_release_version: '6.7',
      connection_uuid: 'abc7f26f-1234-57bd-85d8-de7617123456'
    }
  ]
};

const getReportDeployments = [
  {
    report_id: 'string',
    report: [
      {
        id: 0,
        report_id: 0,
        source_id: 0,
        source_type: 'network',
        bios_uuid: 'string',
        subscription_manager_id: 'string',
        os_name: 'string',
        os_version: 'string',
        os_release: 'string',
        cpu_count: 0,
        cpu_socket_count: 0,
        cpu_core_count: 0,
        cpu_hyperthreading: true,
        cpu_core_per_socket: 0,
        system_creation_date: 'string',
        infrastructure_type: 'virtualized',
        virtualized_is_guest: true,
        virtualized_type: 'string',
        virtualized_num_guests: 0,
        virtualized_num_running_guests: 0,
        virtualized_host: 'string',
        virtualized_host_socket_count: 0,
        virtualized_cluster: 'string',
        virtualized_datacenter: 'string',
        count: 0
      }
    ]
  }
];

const reportsMock = {
  getReportDetail,
  getReportDeployments
};

// Scans
const postScans = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  sources: [0]
};

const postScansResponse = {
  id: 0,
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  jobs: [
    {
      id: 0,
      report_id: 0
    }
  ],
  most_recent: {
    id: 42,
    report_id: 3,
    start_time: '2018-03-01T19:11:07.314Z',
    end_time: '2018-03-01T19:11:07.314Z',
    systems_count: 21,
    systems_scanned: 20,
    systems_failed: 1,
    status: 'completed'
  },
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  }
};

const getScans = {
  count: 0,
  next: 'string',
  previous: 'string',
  results: [
    {
      id: 0,
      sources: [
        {
          id: 0,
          name: 'string',
          source_type: 'network'
        }
      ],
      jobs: [
        {
          id: 0,
          report_id: 0
        }
      ],
      most_recent: {
        id: 42,
        report_id: 3,
        start_time: '2018-03-01T19:11:47.049Z',
        end_time: '2018-03-01T19:11:47.049Z',
        systems_count: 21,
        systems_scanned: 20,
        systems_failed: 1,
        status: 'completed'
      },
      scan_type: 'inspect',
      options: {
        max_concurrency: 0,
        disabled_optional_products: {
          jboss_eap: true,
          jboss_fuse: true,
          jboss_brms: true
        },
        enabled_extended_product_search: {
          jboss_eap: true,
          jboss_fuse: true,
          jboss_brms: true,
          search_directories: ['string']
        }
      }
    }
  ]
};

const getScan = {
  id: 0,
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  jobs: [
    {
      id: 0,
      report_id: 0
    }
  ],
  most_recent: {
    id: 42,
    report_id: 3,
    start_time: '2018-03-01T19:12:23.902Z',
    end_time: '2018-03-01T19:12:23.902Z',
    systems_count: 21,
    systems_scanned: 20,
    systems_failed: 1,
    status: 'completed'
  },
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  }
};

const putScan = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  sources: [0]
};

const putScanResponse = {
  id: 0,
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  jobs: [
    {
      id: 0,
      report_id: 0
    }
  ],
  most_recent: {
    id: 42,
    report_id: 3,
    start_time: '2018-03-01T19:12:49.290Z',
    end_time: '2018-03-01T19:12:49.290Z',
    systems_count: 21,
    systems_scanned: 20,
    systems_failed: 1,
    status: 'completed'
  },
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  }
};

const patchScan = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  sources: [0]
};

const patchScanResponse = {
  id: 0,
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  jobs: [
    {
      id: 0,
      report_id: 0
    }
  ],
  most_recent: {
    id: 42,
    report_id: 3,
    start_time: '2018-03-01T19:13:42.363Z',
    end_time: '2018-03-01T19:13:42.363Z',
    systems_count: 21,
    systems_scanned: 20,
    systems_failed: 1,
    status: 'completed'
  },
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  }
};

const deleteScan = {};

const deleteScanResponse = {};

const postScanJob = {};

const postScanJobResponse = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  id: 0,
  status: 'created',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  tasks: [
    {
      source: 0,
      scan_type: 'inspect',
      status: 'created',
      start_time: '2018-03-01T19:14:27.606Z',
      end_time: '2018-03-01T19:14:27.606Z',
      systems_count: 0,
      systems_scanned: 0,
      systems_failed: 0
    }
  ],
  start_time: '2018-03-01T19:14:27.606Z',
  end_time: '2018-03-01T19:14:27.606Z',
  systems_count: 0,
  systems_scanned: 0,
  systems_failed: 0,
  report_id: 0
};

const getScanJobs = {
  count: 0,
  next: 'string',
  previous: 'string',
  results: [
    {
      scan_type: 'inspect',
      options: {
        max_concurrency: 0,
        disabled_optional_products: {
          jboss_eap: true,
          jboss_fuse: true,
          jboss_brms: true
        },
        enabled_extended_product_search: {
          jboss_eap: true,
          jboss_fuse: true,
          jboss_brms: true,
          search_directories: ['string']
        }
      },
      id: 0,
      status: 'created',
      sources: [
        {
          id: 0,
          name: 'string',
          source_type: 'network'
        }
      ],
      tasks: [
        {
          source: 0,
          scan_type: 'inspect',
          status: 'created',
          start_time: '2018-03-01T19:14:54.685Z',
          end_time: '2018-03-01T19:14:54.685Z',
          systems_count: 0,
          systems_scanned: 0,
          systems_failed: 0
        }
      ],
      start_time: '2018-03-01T19:14:54.685Z',
      end_time: '2018-03-01T19:14:54.685Z',
      systems_count: 0,
      systems_scanned: 0,
      systems_failed: 0,
      report_id: 0
    }
  ]
};

const getScanJob = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  id: 0,
  status: 'created',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  tasks: [
    {
      source: 0,
      scan_type: 'inspect',
      status: 'created',
      start_time: '2018-03-01T19:15:15.123Z',
      end_time: '2018-03-01T19:15:15.123Z',
      systems_count: 0,
      systems_scanned: 0,
      systems_failed: 0
    }
  ],
  start_time: '2018-03-01T19:15:15.123Z',
  end_time: '2018-03-01T19:15:15.123Z',
  systems_count: 0,
  systems_scanned: 0,
  systems_failed: 0,
  report_id: 0
};

const getScanJobResults = {
  connection_results: [
    {
      task_results: [
        {
          source: {
            id: 0,
            name: 'string',
            source_type: 'network'
          },
          systems: [
            {
              name: 'string',
              credential: {
                id: 0,
                name: 'string',
                cred_type: 'network'
              },
              status: 'success'
            }
          ]
        }
      ]
    }
  ],
  inspection_results: [
    {
      task_results: [
        {
          source: {
            id: 0,
            name: 'string',
            source_type: 'network'
          },
          systems: [
            {
              name: 'string',
              facts: [
                {
                  name: 'string',
                  value: 'string'
                }
              ],
              status: 'success'
            }
          ]
        }
      ]
    }
  ]
};

const putScanJobPause = {};

const putScanJobPauseResponse = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  id: 0,
  status: 'created',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  tasks: [
    {
      source: 0,
      scan_type: 'inspect',
      status: 'created',
      start_time: '2018-03-01T19:16:09.643Z',
      end_time: '2018-03-01T19:16:09.643Z',
      systems_count: 0,
      systems_scanned: 0,
      systems_failed: 0
    }
  ],
  start_time: '2018-03-01T19:16:09.643Z',
  end_time: '2018-03-01T19:16:09.643Z',
  systems_count: 0,
  systems_scanned: 0,
  systems_failed: 0,
  report_id: 0
};

const putScanJobCancel = {};

const putScanJobCancelResponse = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  id: 0,
  status: 'created',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  tasks: [
    {
      source: 0,
      scan_type: 'inspect',
      status: 'created',
      start_time: '2018-03-01T19:16:43.076Z',
      end_time: '2018-03-01T19:16:43.076Z',
      systems_count: 0,
      systems_scanned: 0,
      systems_failed: 0
    }
  ],
  start_time: '2018-03-01T19:16:43.076Z',
  end_time: '2018-03-01T19:16:43.076Z',
  systems_count: 0,
  systems_scanned: 0,
  systems_failed: 0,
  report_id: 0
};

const putScanJobRestart = {};

const putScanJobRestartResponse = {
  scan_type: 'inspect',
  options: {
    max_concurrency: 0,
    disabled_optional_products: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true
    },
    enabled_extended_product_search: {
      jboss_eap: true,
      jboss_fuse: true,
      jboss_brms: true,
      search_directories: ['string']
    }
  },
  id: 0,
  status: 'created',
  sources: [
    {
      id: 0,
      name: 'string',
      source_type: 'network'
    }
  ],
  tasks: [
    {
      source: 0,
      scan_type: 'inspect',
      status: 'created',
      start_time: '2018-03-01T19:17:05.313Z',
      end_time: '2018-03-01T19:17:05.313Z',
      systems_count: 0,
      systems_scanned: 0,
      systems_failed: 0
    }
  ],
  start_time: '2018-03-01T19:17:05.313Z',
  end_time: '2018-03-01T19:17:05.313Z',
  systems_count: 0,
  systems_scanned: 0,
  systems_failed: 0,
  report_id: 0
};

const scansMock = {
  postScans,
  postScansResponse,
  getScans,
  getScan,
  putScan,
  putScanResponse,
  patchScan,
  patchScanResponse,
  deleteScan,
  deleteScanResponse,
  postScanJob,
  postScanJobResponse,
  getScanJobs,
  getScanJob,
  getScanJobResults,
  putScanJobPause,
  putScanJobPauseResponse,
  putScanJobCancel,
  putScanJobCancelResponse,
  putScanJobRestart,
  putScanJobRestartResponse
};

// Sources
const postSources = {
  name: 'string',
  source_type: 'network',
  hosts: ['string'],
  port: 0,
  credentials: [0],
  options: {
    satellite_version: '5',
    ssl_cert_verify: true,
    ssl_protocol: 'SSLv2',
    disable_ssl: true
  }
};

const postSourcesResponse = {
  name: 'string',
  source_type: 'network',
  hosts: ['string'],
  port: 0,
  id: 0,
  credentials: [
    {
      id: 0,
      name: 'string',
      cred_type: 'network'
    }
  ],
  options: {
    satellite_version: '5',
    ssl_cert_verify: true,
    ssl_protocol: 'SSLv2',
    disable_ssl: true
  },
  connection: {
    id: 0,
    start_time: '2018-03-01T19:18:54.616Z',
    end_time: '2018-03-01T19:18:54.616Z',
    status: 'created',
    systems_count: 0,
    systems_scanned: 0,
    systems_failed: 0
  }
};

const getSources = {
  count: 0,
  next: 'string',
  previous: 'string',
  results: [
    {
      name: 'string',
      source_type: 'network',
      hosts: ['string'],
      port: 0,
      id: 0,
      credentials: [
        {
          id: 0,
          name: 'string',
          cred_type: 'network'
        }
      ],
      options: {
        satellite_version: '5',
        ssl_cert_verify: true,
        ssl_protocol: 'SSLv2',
        disable_ssl: true
      },
      connection: {
        id: 0,
        start_time: '2018-03-01T19:19:26.616Z',
        end_time: '2018-03-01T19:19:26.616Z',
        status: 'created',
        systems_count: 0,
        systems_scanned: 0,
        systems_failed: 0
      }
    }
  ]
};

const getSource = {
  name: 'string',
  source_type: 'network',
  hosts: ['string'],
  port: 0,
  id: 0,
  credentials: [
    {
      id: 0,
      name: 'string',
      cred_type: 'network'
    }
  ],
  options: {
    satellite_version: '5',
    ssl_cert_verify: true,
    ssl_protocol: 'SSLv2',
    disable_ssl: true
  },
  connection: {
    id: 0,
    start_time: '2018-03-01T19:19:47.685Z',
    end_time: '2018-03-01T19:19:47.685Z',
    status: 'created',
    systems_count: 0,
    systems_scanned: 0,
    systems_failed: 0
  }
};

const putSource = {
  name: 'string',
  source_type: 'network',
  hosts: ['string'],
  port: 0,
  credentials: [0],
  options: {
    satellite_version: '5',
    ssl_cert_verify: true,
    ssl_protocol: 'SSLv2',
    disable_ssl: true
  }
};

const putSourceResponse = {
  name: 'string',
  source_type: 'network',
  hosts: ['string'],
  port: 0,
  id: 0,
  credentials: [
    {
      id: 0,
      name: 'string',
      cred_type: 'network'
    }
  ],
  options: {
    satellite_version: '5',
    ssl_cert_verify: true,
    ssl_protocol: 'SSLv2',
    disable_ssl: true
  },
  connection: {
    id: 0,
    start_time: '2018-03-01T19:20:06.743Z',
    end_time: '2018-03-01T19:20:06.743Z',
    status: 'created',
    systems_count: 0,
    systems_scanned: 0,
    systems_failed: 0
  }
};

const deleteSource = {};

const deleteSourceResponse = {};

const sourcesMock = {
  postSources,
  postSourcesResponse,
  getSources,
  getSource,
  putSource,
  putSourceResponse,
  deleteSource,
  deleteSourceResponse
};

// User
const getUser = {
  username: 'string'
};

const putUserLogout = {};

const putUserLogoutResponse = {};

const userMock = {
  getUser,
  putUserLogout,
  putUserLogoutResponse
};

export { credentialsMock, factsMock, reportsMock, scansMock, sourcesMock, userMock };
