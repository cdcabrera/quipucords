#!/usr/bin/env python
#
# Copyright (c) 2017 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public License,
# version 3 (GPLv3). There is NO WARRANTY for this software, express or
# implied, including the implied warranties of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. You should have received a copy of GPLv3
# along with this software; if not, see
# https://www.gnu.org/licenses/gpl-3.0.txt.
#
""" ScanStartCommand is used to trigger a host scan against a created
network profile
"""

from __future__ import print_function
import sys
from requests import codes
from qpc.request import POST, GET, request
from qpc.clicommand import CliCommand
import qpc.network as network
import qpc.scan as scan


# pylint: disable=too-few-public-methods
class ScanStartCommand(CliCommand):
    """
    This command is for triggering host scans with a profile to gather system
    facts.
    """
    SUBCOMMAND = scan.SUBCOMMAND
    ACTION = scan.START

    def __init__(self, subparsers):
        # pylint: disable=no-member
        CliCommand.__init__(self, self.SUBCOMMAND, self.ACTION,
                            subparsers.add_parser(self.ACTION), POST,
                            scan.SCAN_URI, [codes.created])
        self.parser.add_argument('--profile', dest='profile',
                                 metavar='PROFILE',
                                 help='profile name', required=True)
        self.profile_id = None

    def _validate_args(self):
        CliCommand._validate_args(self)

        # check for existence of profile
        response = request(parser=self.parser, method=GET,
                           path=network.NETWORK_URI,
                           params={'name': self.args.profile},
                           payload=None)
        if response.status_code == codes.ok:  # pylint: disable=no-member
            json_data = response.json()
            if len(json_data) == 1:
                profile_entry = json_data[0]
                self.profile_id = profile_entry['id']
            else:
                print('Profile "%s" does not exist' % self.args.profile)
                sys.exit(1)
        else:
            print('Profile "%s" does not exist' % self.args.profile)
            sys.exit(1)

    def _build_data(self):
        """Construct the dictionary auth given our arguments.

        :returns: a dictionary representing the auth being added
        """
        self.req_payload = {
            'profile': self.profile_id,
            'scan_type': scan.SCAN_TYPE_HOST
        }

    def _handle_response_success(self):
        json_data = self.response.json()
        print('Scan "%s" started' % json_data['id'])