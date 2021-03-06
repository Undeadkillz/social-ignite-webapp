define(['../../module'], controllers => {
    return controllers.controller('profileController', ['$rootScope', '$scope', 'Alert', 'Profile', '$stateParams', 'Billing',
        function ($rootScope, $scope, Alert, Profile, $stateParams, Billing) {
            $scope.updatingProfile = true;
            $scope.setPage('Profile');

            Profile.getUser(message => {
                $scope.updatingProfile = false;
                $scope.user = message.data;
                if ($scope.user.information != null && $scope.user.information.tutorial_step != null) {
                    $scope.tutorialBool = $scope.user.information.tutorial_step === 999;
                }
                Billing.getPlan($scope.user.scope, planDetails => {
                    $scope.planFeatures = planDetails.data;
                }, (status, message) => {
                    Alert.error(message);
                })

            }, (status, message) => {
                $scope.updatingProfile = false;
                Alert.error("Failed to fetch latest profile information.");
            });

            $scope.themeBool = $scope.theme === "dark";

            $scope.defaultTab = 0;

            if ($stateParams.sub != null) {
                if ($stateParams.sub === 'general')
                    $scope.defaultTab = 0;
                else if ($stateParams.sub === 'usages')
                    $scope.defaultTab = 1;
                else if ($stateParams.sub === 'advanced')
                    $scope.defaultTab = 2;
            }


            $scope.checkForm = profile => !profile.$dirty && profile.$valid;
                // ($scope.user.other_auth == null && !) && (!profile.mailing_list.$dirty) && (!profile.theme.$dirty) && (!profile.tutorial.$dirty) && (
                // !($scope.user.other_auth == null || (profile.current_password.$dirty &&
                //     profile.new_password.$dirty &&
                //     profile.confirm_password.$dirty))
            // )) && !profile.$valid;

            $scope.updateUser = profile => {
                if (profile.$valid) {
                    var changed = {};
                    if (profile.email.$dirty) {
                        changed.email = $scope.user.email;
                    }
                    if (profile.theme.$dirty) {
                        changed.theme = $scope.themeBool ? 'dark' : 'default';
                        $scope.user.options.theme = changed.theme;
                        $scope.setTheme(changed.theme);
                    }

                    if (profile.tutorial.$dirty) {
                        changed.tutorial_step = $scope.tutorialBool ? 999 : 0;
                        $scope.user.information.tutorial_step = changed.tutorial_step;
                    }


                    if (profile.mailing_list.$dirty) {
                        changed.mailing_list = $scope.user.mailing_list;
                    }
                    if ($scope.user.other_auth == null) {
                        if (profile.current_password.$dirty && profile.new_password.$dirty && profile.confirm_password.$dirty && $scope.user.other_auth == null) {
                            if ($scope.new_password === $scope.confirm_password
                                && $scope.new_password.length > 0
                                && $scope.current_password.length > 0
                            ) {
                                changed.new_password = $scope.new_password;
                                changed.current_password = $scope.current_password;
                            }
                        }
                    }

                    Profile.updateUser(changed, message => {
                        if (message.email) {
                            Alert.success("Please open the link sent to " + changed.email)
                        } else {
                            Alert.success("Your settings have been updated.")
                        }
                        profile.$setPristine();
                        profile.$setUntouched();
                        if (message.password) {
                            $scope.current_password = "";
                            $scope.new_password = "";
                            $scope.confirm_password = "";
                        }
                    }, (status, message) => {
                        Alert.error("Failed to update user info. " + message);
                    });
                }
            };

            $scope.deleteAccount = () => {
                Profile.deleteUser(data => {
                    Alert.success("Check your email for instructions.");
                }, (status, message) => {
                    Alert.error(message);
                })
            };




        }]);
});

