#
# Copyright (c) 2017-2018 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public License,
# version 3 (GPLv3). There is NO WARRANTY for this software, express or
# implied, including the implied warranties of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. You should have received a copy of GPLv3
# along with this software; if not, see
# https://www.gnu.org/licenses/gpl-3.0.txt.
#
"""Test the report API."""

import copy
import json
import tarfile

from api.common.common_report import create_report_version
from api.common.report_json_gzip_renderer import ReportJsonGzipRenderer
from api.details_report.csv_renderer import (DetailsCSVRenderer)
from api.models import (Credential,
                        DetailsReport,
                        ServerInformation,
                        Source)

from django.core import management
from django.test import TestCase
from django.urls import reverse

from rest_framework import status


class DetailReportTest(TestCase):
    """Tests against the Detail reports function."""

    def setUp(self):
        """Create test case setup."""
        management.call_command('flush', '--no-input')
        self.net_source = Source.objects.create(
            name='test_source', source_type=Source.NETWORK_SOURCE_TYPE)

        self.net_cred = Credential.objects.create(
            name='net_cred1',
            cred_type=Credential.NETWORK_CRED_TYPE,
            username='username',
            password='password',
            become_password=None,
            ssh_keyfile=None)
        self.net_source.credentials.add(self.net_cred)

        self.net_source.hosts = '["1.2.3.4"]'
        self.net_source.save()
        self.server_id = ServerInformation.create_or_retreive_server_id()
        self.report_version = create_report_version()

    def tearDown(self):
        """Create test case tearDown."""
        pass

    def create(self, data):
        """Call the create endpoint."""
        url = reverse('reports-list')
        return self.client.post(url,
                                json.dumps(data),
                                'application/json')

    def create_expect_201(self, data):
        """Create a source, return the response as a dict."""
        response = self.create(data)
        if response.status_code != status.HTTP_201_CREATED:
            print('Failure cause: ')
            print(response.json())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response.json()

    def retrieve_expect_200(self, identifier):
        """Create a source, return the response as a dict."""
        url = '/api/v1/reports/' + str(identifier) + '/details/'
        response = self.client.get(url)

        if response.status_code != status.HTTP_200_OK:
            print('Failure cause: ')
            print(response.json())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.json()

    def test_get_details_report_404(self):
        """Fail to get a report for missing collection."""
        url = '/api/v1/reports/24/details/'

        # Query API
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    ##############################################################
    # Test details endpoint
    ##############################################################
    def test_details(self):
        """Get details for a report via API."""
        request_json = {'report_type': 'details',
                        'sources':
                        [{'server_id': self.server_id,
                          'report_version': create_report_version(),
                          'source_name': self.net_source.name,
                          'source_type': self.net_source.source_type,
                          'facts': [{'key': 'value'}]}]}

        response_json = self.create_expect_201(
            request_json)
        identifier = response_json['report_id']
        response_json = self.retrieve_expect_200(identifier)
        self.assertEqual(response_json['report_id'], identifier)

    ##############################################################
    # Test CSV Renderer
    ##############################################################
    def test_csv_renderer(self):
        """Test DetailsCSVRenderer."""
        renderer = DetailsCSVRenderer()
        # Test no FC id
        test_json = {}
        value = renderer.render(test_json)
        self.assertIsNone(value)

        # Test doesn't exist
        test_json = {'id': 42}
        value = renderer.render(test_json)
        self.assertIsNone(value)

        request_json = {'report_type': 'details',
                        'sources':
                        [{'server_id': self.server_id,
                          'report_version': create_report_version(),
                          'source_name': self.net_source.name,
                          'source_type': self.net_source.source_type,
                          'facts': [{'key': 'value'}]}]}

        response_json = self.create_expect_201(
            request_json)
        test_json = copy.deepcopy(response_json)
        csv_result = renderer.render(test_json)
        # pylint: disable=line-too-long
        expected = 'Report ID,Report Type,Report Version,Report Platform ID,Number Sources\r\n1,details,%s,%s,1\r\n\r\n\r\nSource\r\nServer Identifier,Source Name,Source Type\r\n%s,test_source,network\r\nFacts\r\nkey\r\nvalue\r\n\r\n\r\n' % (self.report_version, test_json.get('report_platform_id'), self.server_id)  # noqa
        self.assertEqual(csv_result, expected)

        # Test cached works too
        test_json = copy.deepcopy(response_json)
        test_json['sources'][0]['facts'] = []
        csv_result = renderer.render(test_json)
        # These would be different if not cached
        self.assertEqual(csv_result, expected)

        # Clear cache
        details_report = DetailsReport.objects.get(
            report_id=response_json['report_id'])
        details_report.cached_csv = None
        details_report.save()

        # Remove sources
        test_json = copy.deepcopy(response_json)
        test_json['sources'] = None
        csv_result = renderer.render(test_json)
        expected = 'Report ID,Report Type,Report Version,Report Platform ID,Number Sources\r\n1,details,%s,%s,0\r\n' % (self.report_version, test_json.get('report_platform_id'))  # noqa
        self.assertEqual(csv_result, expected)

        # Clear cache
        details_report = DetailsReport.objects.get(
            id=response_json['report_id'])
        details_report.cached_csv = None
        details_report.save()

        # Remove sources
        test_json = copy.deepcopy(response_json)
        test_json['sources'] = []
        csv_result = renderer.render(test_json)
        expected = 'Report ID,Report Type,Report Version,Report Platform ID,Number Sources\r\n1,details,%s,%s,0\r\n\r\n\r\n' % (self.report_version, test_json.get('report_platform_id'))  # noqa
        self.assertEqual(csv_result, expected)

        # Clear cache
        details_report = DetailsReport.objects.get(
            report_id=response_json['report_id'])
        details_report.cached_csv = None
        details_report.save()

        # Remove facts
        test_json = copy.deepcopy(response_json)
        test_json['sources'][0]['facts'] = []
        csv_result = renderer.render(test_json)
        # pylint: disable=line-too-long
        expected = 'Report ID,Report Type,Report Version,Report Platform ID,Number Sources\r\n1,details,%s,%s,1\r\n\r\n\r\nSource\r\nServer Identifier,Source Name,Source Type\r\n%s,test_source,network\r\nFacts\r\n\r\n' % (self.report_version, test_json.get('report_platform_id'), self.server_id)  # noqa
        self.assertEqual(csv_result, expected)

    ##############################################################
    # Test Json Gzip Render
    ##############################################################
    def test_json_gzip_renderer(self):
        """Test ReportJsonGzipRenderer for details."""
        renderer = ReportJsonGzipRenderer()
        # Test no FC id
        test_json = {}
        value = renderer.render(test_json)
        self.assertIsNone(value)

        request_json = {'report_type': 'details',
                        'sources':
                        [{'server_id': self.server_id,
                          'report_version': create_report_version(),
                          'source_name': self.net_source.name,
                          'source_type': self.net_source.source_type,
                          'facts': [{'key': 'value'}]}]}

        report_dict = self.create_expect_201(
            request_json)

        # Test that the data in the subfile equals the report_dict
        tar_gz_result = renderer.render(report_dict)
        tar = tarfile.open(fileobj=tar_gz_result)
        json_file = tar.getmembers()[0]
        tar_info = tar.extractfile(json_file)
        tar_dict_data = json.loads(tar_info.read().decode())
        self.assertEqual(tar_dict_data, report_dict)
