define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminUsersSubController', ['$scope', '$stateParams', 'Alert', '$state', 'AdminAccount', '$timeout',
        function ($scope, $stateParams, Alert, $state, AdminAccount, $timeout) {
            $scope.accountId = $stateParams.accountId;
            $scope.today = new Date();

            if ($scope.accountId != null) {
                AdminAccount.getAccount($scope.accountId, function (data) {
                    $scope.account = data.data;
                }, function (status, message) {
                    Alert.error(message);
                });



                $scope.checkForm = function(profile){
                    return ((!profile.email.$dirty) && (!profile.mailing_list.$dirty) && (
                        !(profile.new_password.$dirty &&
                            profile.confirm_password.$dirty)
                    )) || !profile.$valid;
                };


                $scope.updateUser = function (profile) {

                    if (profile.$valid) {
                        var changed = {};
                        if (profile.email.$dirty) {
                            changed.email = $scope.account.email;
                        }
                        if (profile.mailing_list.$dirty) {
                            changed.mailing_list = $scope.account.mailing_list;
                        }
                        if (profile.new_password.$dirty && profile.confirm_password.$dirty) {
                            if ($scope.new_password == $scope.confirm_password
                                && $scope.new_password.length > 0
                            ) {
                                changed.new_password = profile.new_password.$modelValue;
                            }
                        }

                        AdminAccount.updateAccount($scope.accountId, changed, function (message) {
                            Alert.success("This users settings have been updated.");
                            profile.$setPristine();
                            profile.$setUntouched();
                            if (message.password) {
                                $scope.new_password = "";
                                $scope.confirm_password = "";
                            }
                        }, function (status, message) {
                            Alert.error("Failed to update user info. " + message);
                        });
                    }
                };

                $scope.updateRole = function (role_form) {
                    if (role_form.$valid) {
                        console.log($scope.role);
                        AdminAccount.updateRole($scope.accountId, $scope.account.role, $scope.account.expiry, function (message) {
                            Alert.success("This user's role has been updated.");
                            role_form.$setPristine();
                            role_form.$setUntouched();
                        }, function (status, message) {
                            Alert.error("Failed to update user role. " + message);
                        });
                    }
                };

                $scope.deleteAccount = function () {

                };
            }




        }]);
});

