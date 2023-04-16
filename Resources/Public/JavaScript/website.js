/*
    Name: Mdlr
    Description: Modular web frontend library for use in accessible web apps
    Author: Jonatan Jalle Steller
    Version: 0.3.0

    The interface library is designed to work with semantic HTML code.
    This file is set up in the following sections: basics, individual controls.
*/


/*
# Basics ######################################################################
*/

// Identify elements
function mdlr_elements( selector ) {
    return Array.prototype.slice.call( document.querySelectorAll( selector ), 0);
}


/*
# Web App #####################################################################
*/

// Register service worker
if ( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register('serviceworker.js')

    // Successful registration
    .then( function( registration ) {
        //console.log('Service worker registration succeeded:', registration);

    // Unsuccessful registration attempt
    }, function( error ) {
        //console.log('Service worker registration failed:', error);
    } );
}

// Show a functioning install button if the app is not installed yet
window.addEventListener( 'beforeinstallprompt', (e) => {
    const deferredPrompt = e;

    // Display the install button
    const installButton = document.getElementById( 'install' );
    installButton.hidden = false;
    setTimeout( function () {
        installButton.classList.add( 'mdlr-variant-visible' );
    }, 50 );
  
    // When the button is clicked, show the install prompt
    document.getElementById( 'install-button' ).addEventListener( 'click', ( e ) => {
        deferredPrompt.prompt();
    } );
    document.getElementById( 'install-button' ).addEventListener( 'keydown', function( e ) {
        if( e.code == 'Enter' || e.code == 'Space' ) {
            deferredPrompt.prompt();
            e.preventDefault();
        }
    });

    // Wait for the user response and show a notification
    deferredPrompt.userChoice.then( ( choice ) => {

        // Case 1: user installs app
        if ( choice.outcome === 'accepted' ) {
            mdlr_toast_open( 'notification', 'Erfolgreich installiert' );

        // Case 2: user does not install app
        } else {
            mdlr_toast_open( 'notification', 'App leider nicht installiert' );
        }

        // Hide the button
        installButton.classList.remove( 'mdlr-variant-visible' );
        setTimeout( function () {
            installButton.hidden = true;
        }, 350 );

        // Reset the variable
        deferredPrompt = null;
    } );
} );


/*
# Staged Elements #############################################################
Contains the logic for elements that should be animated when they enter the
viewport. This is done using CSS classes and the Intersection Observer API.
*/

// Function to animate progress bars
var tick = 0;
var count = 0;
function mdlr_staged_progress( stagedElement ) {
    setTimeout( function() {

        // Variables
        let tickTarget = 50; /* 50 * 10 = 500 milliseconds = 0.5 seconds */
        let countTarget = stagedElement.dataset.value;

        // Logic
        tick++;
        count += countTarget / tickTarget;
        stagedElement.value = count;

        // Repeat as long as the target is not reached
        if( tick < tickTarget ) {
            mdlr_staged_progress( stagedElement );
        }
    }, 10 )
}

// Set up observer
const stagedOptions = {
    threshold: 0.5
}

// Add or remove a class when the elements hit or exit the viewport
const stagedCallback = ( entries, observer ) => {
    entries.forEach( function( entry ) {
        let stagedElement = entry.target;

        // Routine for entering the viewport
        if( entry.isIntersecting ) {
            setTimeout( function () {
                stagedElement.classList.remove( 'mdlr-variant-staged' );

                // Progress bars
                if( stagedElement.classList.contains( 'mdlr-variant-progress' ) ) {
                    mdlr_staged_progress( stagedElement );
                }
            }, 200 );
        }

        // Routine for exiting the viewport
        else {
            stagedElement.classList.add( 'mdlr-variant-staged' );

            // Progress bars
            if( stagedElement.classList.contains( 'mdlr-variant-progress' ) ) {
                stagedElement.value = 0;
                tick = 0;
                count = 0;
            }
        }
    } );
}

// Initialise the observer
const stagedObserver = new IntersectionObserver( stagedCallback, stagedOptions );
const stagedTargets = mdlr_elements( '.mdlr-function-staged' );
stagedTargets.forEach( function ( stagedTarget ) {
    stagedObserver.observe( stagedTarget );
} );


/*
# Header Bar ##################################################################
*/

// Variable
const headerBars = mdlr_elements( '.mdlr-headerbar' );

// Set up observer
const headerOptions = {
    rootMargin: '80px 0px 0px 0px',
    threshold: 1
}

// Add or remove a class when a reference element hits or exits the viewport
const headerCallback = ( entries, observer ) => {
    entries.forEach( function( entry ) {

        // Routine for entering the viewport
        if( entry.isIntersecting ) {
            headerBars.forEach( function( headerBar ) {
                headerBar.classList.remove( 'mdlr-variant-scrolled' );
            } );
        }

        // Routine for exiting the viewport
        else {
            headerBars.forEach( function( headerBar ) {
                headerBar.classList.add( 'mdlr-variant-scrolled' );
            } );
        }
    } );
}

// Initialise the observer
const headerObserver = new IntersectionObserver( headerCallback, headerOptions );
const headerTargets = mdlr_elements( '.mdlr-function-scroll' );
headerTargets.forEach( function ( headerTarget ) {
    headerObserver.observe( headerTarget );
} );


/*
# Back and Up #################################################################
*/

// Variable
const backButtons = mdlr_elements( '.mdlr-function-back' );
const upButtons = mdlr_elements( '.mdlr-function-up' );

// Listener: back
if( backButtons ) {
    backButtons.forEach( function( backButton ) {
        backButton.addEventListener( 'click', function( e ) {
            history.back();
        } );
        backButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                history.back();
                e.preventDefault();
            }
        });
    } );
}

// Listener: up
if( upButtons ) {
    upButtons.forEach( function( upButton ) {
        upButton.addEventListener( 'click', function( e ) {
            e.preventDefault();
            window.scrollTo( 0, 0 );
        } );
        upButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                e.preventDefault();
                window.scrollTo( 0, 0 );
            }
        });
    } );
}


/*
# Jump & Sections #############################################################
*/

// Variables
const jumpLinks = mdlr_elements( '.mdlr-function-jump' );
const sectionContainers = mdlr_elements( '.mdlr-sections' );
const sectionSegments = mdlr_elements( '.mdlr-sections-segment' );

// Listeners
if( jumpLinks && sectionContainers && sectionSegments ) {

    // Scroll to segment when you click on a jump link
    jumpLinks.forEach( function( jumpLink ) {
        jumpLink.addEventListener( 'click', function( e ) {
            mdlr_jump_click( e.currentTarget );
            e.preventDefault();
        } );
        jumpLink.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_jump_click( e.currentTarget );
                e.preventDefault();
            }
        });
    } );

    // Keep just one segment in view when the window is resized
    window.addEventListener( 'resize', function( e ) {
        sectionContainers.forEach( function( sectionContainer ) {
            sectionContainer.scrollBy( 0, 0 );
        } );
    } );
}

// Scroll to the right position when a jump link is clicked
function mdlr_jump_click( clickedJumpLink ) {

    // Identify the target segment
    var targetID = clickedJumpLink.href;
    targetID = targetID.substring( targetID.indexOf( '#' ) );
    const targets = mdlr_elements( targetID );

    // Small screens: scroll segment into view without scrolling vertically
    if( document.documentElement.clientWidth < 600 ) {
        sectionContainers.forEach( function( sectionContainer ) {
            targets.forEach( function( target ) {
                sectionContainer.scrollLeft = target.offsetLeft;
            } );
        } );
    }

    // Large screen: regularly scroll segment into view
    else {
        targets.forEach( function( target ) {
            window.scrollTo( 0, target.offsetTop - 50 );
        } );
    }
}

// Small screens: set up observer
const sectionSmallOptions = {
    root: document.querySelector( '.mdlr-sections' ),
    rootMargin: "0px -10px 0px -10px",
    threshold: 0
}

// Small screens: add or remove a class when a section hits or exits the viewport
const sectionSmallCallback = ( entries, observer ) => {
    entries.forEach( function( entry ) {
        const entryJumpLinks = mdlr_elements( '.mdlr-function-jump[href*=' + entry.target.id + ']' );

        // Routine for entering the viewport
        if( entry.isIntersecting ) {
            entryJumpLinks.forEach( function( entryJumpLink ) {
                entryJumpLink.classList.add( 'mdlr-variant-active' );
            } );
        }

        // Routine for exiting the viewport
        else {
            entryJumpLinks.forEach( function( entryJumpLink ) {
                entryJumpLink.classList.remove( 'mdlr-variant-active' );
            } );
        }
    } );
}

// Large screens: set up observer
const sectionLargeOptions = {
    threshold: 0.25
}

// Large screens: add or remove a class when a section hits or exits the viewport
const sectionLargeCallback = ( entries, observer ) => {
    entries.forEach( function( entry ) {
        const entryJumpLinks = mdlr_elements( '.mdlr-function-jump[href*=' + entry.target.id + ']' );

        // Routine for entering the viewport
        if( entry.isIntersecting ) {
            entryJumpLinks.forEach( function( entryJumpLink ) {
                entryJumpLink.classList.add( 'mdlr-variant-inview' );
            } );
        }

        // Routine for exiting the viewport
        else {
            entryJumpLinks.forEach( function( entryJumpLink ) {
                entryJumpLink.classList.remove( 'mdlr-variant-inview' );
            } );
        }
    } );
}

// Small and large screens: initialise the observers
const sectionSmallObserver = new IntersectionObserver( sectionSmallCallback, sectionSmallOptions );
const sectionLargeObserver = new IntersectionObserver( sectionLargeCallback, sectionLargeOptions );
sectionSegments.forEach( function ( sectionSegment ) {
    sectionSmallObserver.observe( sectionSegment );
    sectionLargeObserver.observe( sectionSegment );
} );


/*
# Tabs ########################################################################
*/

// Variables
const tabs = mdlr_elements( '.mdlr-function-tab' );
const tabSegments = mdlr_elements( '.mdlr-tabs-segment' );

// Listener: activate tab and segment when a tab button is clicked
if( tabs && tabSegments ) {
    tabs.forEach( function( tab ) {
        tab.addEventListener( 'click', function( e ) {
            mdlr_tabs( e.currentTarget );
            e.preventDefault();
        } );
        tab.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_tabs( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Activate the clicked tab and the desired segment
function mdlr_tabs( clickedTab ) {

    // Deactivate all tabs and activate the clicked one tab
    tabs.forEach( function( tab ) {
        tab.classList.remove( 'mdlr-variant-active' );
    } );
    clickedTab.classList.add( 'mdlr-variant-active' );

    // Identify the target segment
    var targetID = clickedTab.href;
    targetID = targetID.substring( targetID.indexOf( '#' ) );
    const targets = mdlr_elements( targetID );

    // Check whether the target is active already
    var check = false;
    targets.forEach( function( target ) {
        if( target.hidden == false ) {
            check = true;
        }
    } );

    // If the target is not active yet, deactivate all segments (with an animation delay)
    if( check == false ) {
        tabSegments.forEach( function( tab ) {
            tab.classList.remove( 'mdlr-variant-active' );
            setTimeout( function () {
                tab.hidden = true;

                // And activate the desired one
                targets.forEach( function( target ) {
                    target.hidden = false;
                    setTimeout( function () {
                        target.classList.add( 'mdlr-variant-active' );
                    }, 50 );
                } );
            }, 100 );
        } );
    }
}


/*
# Accordion ###################################################################
*/

// Variables
const accordionHandles = mdlr_elements( '.mdlr-function-accordion-handle' );

// Listener: activate tab and segment when a tab button is clicked
if( accordionHandles ) {
    accordionHandles.forEach( function( accordionHandle ) {
        accordionHandle.addEventListener( 'click', function( e ) {
            mdlr_accordion( e.currentTarget );
        } );
        accordionHandle.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_accordion( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Activate the clicked tab and the desired segment
function mdlr_accordion( clickedHandle ) {

    // Toggle the accordion handle
    clickedHandle.classList.toggle( 'mdlr-variant-open' );
    if( clickedHandle.getAttribute( 'aria-expanded' ) == 'false' ) {
        clickedHandle.setAttribute( 'aria-expanded', 'true' );
    }
    else {
        clickedHandle.setAttribute( 'aria-expanded', 'false' );
    }

    // Toogle the accordion content
    document.getElementById( clickedHandle.getAttribute( 'aria-controls' ) ).classList.toggle( 'mdlr-variant-open' );
}


/*
# Share #######################################################################
*/

// Variable
const shareButtons = mdlr_elements( '.mdlr-function-share' );

// Listener: activate all device-specific share buttons
if( shareButtons ) {
    shareButtons.forEach( function( shareButton ) {
        shareButton.addEventListener( 'click', function( e ) {
            mdlr_share( e.currentTarget );
        } );
        shareButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_share( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Enable the device-specific share buttons only when the feature is available
if( navigator.canShare && navigator.canShare( {
    title: 'Sample Headline',
    url: 'https://www.adwmainz.de/'
    } ) ) {
    shareButtons.forEach( function( shareButton ) {
        shareButton.classList.add( 'mdlr-variant-available' );
    } );
}

// Open the host's share dialog
async function mdlr_share( clickedElement ) {

    // Retrieve the data to share
    const shareData = {
        title: clickedElement.dataset.title,
        url: clickedElement.dataset.target
    }

    // Make the request
    if( navigator.canShare( shareData ) ) {
        try {
            await navigator.share( shareData )
            mdlr_toast_open( 'notification', 'Erfolgreich geteilt' );
        } catch( error ) {
            mdlr_toast_open( 'notification', 'Es wurde nichts geteilt' );
        }
    }
    else {
        mdlr_toast_open( 'notification', 'Hat leider nicht geklappt' );
    }
}


/*
# Copy ########################################################################
*/

// Variable
const copyButtons = mdlr_elements( '.mdlr-function-copy' );

// Listener: activate all copy buttons
if( copyButtons ) {
    copyButtons.forEach( function( copyButton ) {
        copyButton.addEventListener( 'click', function( e ) {
            mdlr_copy( e.currentTarget );
        } );
        copyButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_copy( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Copy the desired content
function mdlr_copy( clickedElement ) {
    if( clickedElement ) {

        // Get content from the data-target field
        var content = clickedElement.dataset.target;

        // Copy the target string to the clipboard
        if( content ) {
            navigator.clipboard.writeText( content )

                // Show a success notification
                .then( function() {
                    mdlr_toast_open( 'notification', 'Erfolgreich kopiert' );

                // Or show a failure notification
                }, function() {
                    mdlr_toast_open( 'notification', 'Hat leider nicht geklappt' );
                } );
        }
    }
}


/*
# Form: settings ##############################################################

Any existing cookies are used by Typo3 to set switches when the page is loaded.
On load, mdlr_switch_system() then updates the 'system' fields of the settings
object. When a switch or radio button is clicked, the function chain is as
follows: mdlr_switch() retrieves switch state -> mdlr_settings_current()
updates the settings object -> mdlr_settings_set() sets a cookie if necessary
and applies the changed setting. The function mdlr_settings_remove() is often
called with the attribute full=false to remove unnecessary settings cookies,
but the reset button calls it with the attribute full=true.
*/

// Variables
const switches = mdlr_elements( '.mdlr-function-switch' );
const switchRadios = mdlr_elements( '.mdlr-function-switch-radio' );
const switchResets = mdlr_elements( '.mdlr-function-switch-reset' );

// Listener: activate any switches
if( switches ) {
    switches.forEach( function( singleSwitch ) {
        singleSwitch.addEventListener( 'change', function( e ) {
            mdlr_switch( e.currentTarget, 'switch' );
        } );
    } );
}

// Listener: activate any radio-button inputs
if( switchRadios ) {
    switchRadios.forEach( function( switchRadio ) {
        switchRadio.addEventListener( 'change', function( e ) {
            mdlr_switch( e.currentTarget, 'radio' );
        } );
    } );
}

// Listener: activate any switch reset buttons
if( switchResets ) {
    switchResets.forEach( function( switchReset ) {
        switchReset.addEventListener( 'click', function( e ) {
            mdlr_settings_remove( true );
        } );
        switchReset.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_settings_remove( true );
                e.preventDefault();
            }
        });
    } );
}


// Executes visual actions when switches, checkboxes, or radio buttons are clicked
function mdlr_switch( clickedElement, type ) {
    if( clickedElement ) {

        // Find out whether the switch is checked and identify the target action
        var checked = false;
        if ( clickedElement.checked == true ) {
            checked = true;
        }
        const target = clickedElement.dataset.target;

        // Switch: enable or disable inputs in a specified element
        if( type == 'switch' ) {
            const targetInputs = document.getElementById ( target ).getElementsByTagName( 'input' );

            // Go through the input elements and enable/disable them based on the switch's state
            for( let targetInput of targetInputs ) {
                if( checked == true ) {
                    targetInput.disabled = true;
                }
                else {
                    targetInput.disabled = false;
                }
            }
        }

        // Radio: no additional action
        else if( type == 'radio' ) {
        }

        // Update the settings object
        mdlr_settings_current();
    }
}

// Settings object: initialise
let settings = {
    language: {
        system: 'de',
        current: 'de'
    },
    theme: {
        system: 'light',
        current: 'light'
    }
}

// Settings object: get system values
function mdlr_settings_system() {

    // Languages
    let languages = [ 'de', 'de-DE', 'de-AT', 'de-CH', 'de-LI', 'de-LU' ]
    if( ! languages.includes( navigator.language ) ) {
        settings.language.system = 'en';
    }
    
    // Theme
    if ( window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
        settings.theme.system = 'dark';
    }

    // Theme: listener
    window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', function( e ) {
        if ( e.matches ) {
            settings.theme.system = 'dark';
        }
        else {
            settings.theme.system = 'light';
        }
    });
}
if( switches ) {
    mdlr_settings_system();
}

// Settings object: get current values
function mdlr_settings_current() {
    const dataElement = document.getElementById( 'settings' );
    if( dataElement ) {
        const data = new FormData( dataElement );
        for( var [ key, value ] of data ) {
        
            // Clean keys and values: if switches are on, use the 'system' value as the default
            if( key == 'language' || key == 'theme' ) {
                value = settings[key].system;
            }

            // Clean keys and values: if switches are off, revise the key since the value is correct already
            else if( key == 'language-request' ) {
                key = 'language';
            }
            else if( key == 'theme-request' ) {
                key = 'theme';
            }
        
            // Write the values to the settings object
            settings[key].current = value;
        }

        // Call the 'set' function to implement the changes
        mdlr_settings_set();
    }
}
if( switches ) {
    mdlr_settings_current();
}

// Settings routine: implement immediate actions and set cookies if necessary
function mdlr_settings_set() {

    // Remove the cookie in case the user switched back to a standard setting
    mdlr_settings_remove( false );

    // Compare system and current settings and add settings to a cookie string if necessary
    var cookie = '';
    if( settings.language.current != settings.language.system ) {
        cookie += 'language:' + settings.language.current;
    }
    if( settings.theme.current != settings.theme.system ) {
        if( cookie != '' ) {
            cookie += '&';
        }
        cookie += 'theme:' + settings.theme.current;
    }

    // If there is a cookie string, set the cookie
    if( cookie != '' ) {
        document.cookie = 'settings=' + cookie + '; SameSite=Strict; Secure; max-age=2592000'; /* 30 days, aka 60*60*24*30 */

        // Show the reset button
        switchResets.forEach( function( switchReset ) {
            switchReset.parentElement.parentElement.hidden = false;
            setTimeout( function () {
                switchReset.parentElement.parentElement.classList.remove( 'mdlr-variant-invisible' );
            }, 50 );
        } );
    }

    // Deliver actions based on the settings
    if( settings.language.current != settings.language.system ) {
        alert( 'Platzhalter für Typo3: andere Sprache laden' )
        // location.reload();
    }
    if( settings.theme.current != settings.theme.system ) {
        document.body.classList.add( 'mdlr-variant-theme-' + settings.theme.current );
        settings.theme.current = settings.theme.system;
    }
}

// Settings routine: return everything to standard settings and remove the cookie
function mdlr_settings_remove( full ) {

    // Remove the cookie
    document.cookie = "settings=; SameSite=Strict; Secure; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Hide the reset button
    switchResets.forEach( function( switchReset ) {
        switchReset.parentElement.parentElement.classList.add( 'mdlr-variant-invisible' );
        setTimeout( function () {
            switchReset.parentElement.parentElement.hidden = true;
        }, 350 );
    } );

    // Reset the theme
    document.body.classList.remove( 'mdlr-variant-theme-dark' );
    document.body.classList.remove( 'mdlr-variant-theme-light' );

    // Only reset the display if a full reset is requested via the reset button
    if( full == true ) {

        // Check if there was a languge change
        let languageChange = false;
        if( settings.language.current != settings.language.system ) {
            languageChange = true;
        }

        // Reset switches and 
        document.getElementById( 'settings' ).reset();
    
        // Reset the language (but only if it was reset from a non-system value)
        if( languageChange ) {
            location.reload();
        }
    }
}


/*
# Form: search ################################################################
*/

// Variables
const searchInputs = mdlr_elements( '.mdlr-function-search-suggest' );
const searchSwitches = mdlr_elements( '.mdlr-function-search-type' );

// Listener: activate and update search suggestions on demand
if( searchInputs ) {
    searchInputs.forEach( function( searchInput ) {
        searchInput.addEventListener( 'input', function( e ) {
            mdlr_search( e.currentTarget );
        } );
    } );
}

// Listener: activate any switches in search inputs
if( searchSwitches ) {
    searchSwitches.forEach( function( searchSwitch ) {
        searchSwitch.addEventListener( 'change', function( e ) {
            mdlr_search_switch( e.currentTarget );
        } );
    } );
}

// Opens and updates search suggestions as you type
function mdlr_search( clickedElement ) {
    if( clickedElement ) {

        // Find out whether the search input contains text
        var show = false;
        if( clickedElement.value != '' ) {
            show = true;
        }
        const target = document.getElementById ( clickedElement.getAttribute( 'aria-controls' ) );

        // Activate or deactivate the hint
        if( show ) {
            target.hidden = false;
            setTimeout( function () {
                target.classList.add( 'mdlr-variant-active' );
                clickedElement.setAttribute( 'aria-expanded', 'true' );
            }, 50 );
        }
        else {
            target.classList.remove( 'mdlr-variant-active' );
            clickedElement.setAttribute( 'aria-expanded', 'false' );
            setTimeout( function () {
                target.hidden = true;
            }, 350 );
        }

        // Typo3 placeholder: retrieve the right entries
    }
}

// Executes actions when switches in search inputs are clicked
function mdlr_search_switch( clickedElement ) {
    if( clickedElement ) {

        // Find out whether the switch is checked and identify the target action
        var checked = false;
        if ( clickedElement.checked == true ) {
            checked = true;
        }
        const target = document.getElementById ( clickedElement.dataset.target );

        // Activate or deactivate the hint
        if( checked ) {
            target.hidden = false;
            setTimeout( function () {
                target.classList.add( 'mdlr-variant-active' );
            }, 50 );
        }
        else {
            target.classList.remove( 'mdlr-variant-active' );
            setTimeout( function () {
                target.hidden = true;
            }, 350 );
        }
    }
}


/*
# Select ######################################################################
*/

// Variable
const selectButtons = mdlr_elements( '.mdlr-select button' );

// Listener: activate all select labels
if( selectButtons ) {
    selectButtons.forEach( function( selectButton ) {
        selectButton.addEventListener( 'click', function( e ) {
            mdlr_select( e.currentTarget );
            e.preventDefault();
        } );
        selectButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_select( e.currentTarget );
                e.preventDefault();
            }
        } );
    } );
}

// Open or close a clicked select element
function mdlr_select( clickedElement ) {
    if( clickedElement ) {

        // Get the select element
        var select = clickedElement.parentElement;

        // If the select element is open, close it
        if( select.classList.contains( 'mdlr-variant-active' ) ) {
            clickedElement.setAttribute( 'aria-expanded', 'false' );
            select.classList.remove( 'mdlr-variant-active' );
        }

        // If it is closed, open it
        else {
            clickedElement.setAttribute( 'aria-expanded', 'true' );
            select.classList.add( 'mdlr-variant-active' );

            // Set a one-time listener to close it on the next click anywhere in the document
            setTimeout( function () {
                document.addEventListener( 'click', function( e ) {
                    clickedElement.setAttribute( 'aria-expanded', 'false' );
                    select.classList.remove( 'mdlr-variant-active' );
                }, { once: true } );
            }, 300 );
        }
    }
}


/*
# Toasts ######################################################################
*/

// Variables
const toastContainers = mdlr_elements( '.mdlr-toasts' );
const toasts = mdlr_elements( '.mdlr-function-toast' );
const toastButtons = mdlr_elements( '.mdlr-function-toast-close' );

// Listeners: close toast notifications when you click on the 'dismiss' button
if( toastButtons ) {
    toastButtons.forEach( function( toastButton ) {
        toastButton.addEventListener( 'click', function( e ) {
            mdlr_toast_close( false );
        } );
        toastButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_toast_close( false );
                e.preventDefault();
            }
        } );
    } );
}

// Open a toast notification
function mdlr_toast_open( toastId, toastText ) {

    // Close any open notifications
    mdlr_toast_close( true );

    // Activate all notification containers
    toastContainers.forEach( function( toastContainer ) {
        toastContainer.hidden = false;
        toastContainer.setAttribute( 'aria-hidden', 'false' );
    } );

    // Add the notification text and activate it with a brief delay to feel real and avoid animation issues
    var toast = document.getElementById( toastId );
    toast.firstElementChild.textContent = toastText;
    setTimeout( function() {
        toast.classList.add( 'mdlr-variant-active' );
    }, 300);

    // Remove notification again after a delay
    setTimeout( function() {
        mdlr_toast_close( false );
    }, 3300);
}

// Close toast notifications
function mdlr_toast_close( quick ) {

    // Remove active notifications
    toasts.forEach( function( toast ) {
        toast.classList.remove( 'mdlr-variant-active' );
    } );

    // If quick: remove container immediately
    if( quick == true ) {
        toastContainers.forEach( function( toastContainer ) {
            toastContainer.hidden = true;
            toastContainer.setAttribute( 'aria-hidden', 'true' );
        } );
    }

    // If regular: remove container after an animation delay
    else {
        setTimeout( function() {
            toastContainers.forEach( function( toastContainer ) {
                toastContainer.hidden = true;
                toastContainer.setAttribute( 'aria-hidden', 'true' );
            } )
        }, 500);
    }
}


/*
# Modal #######################################################################
*/

// Variables
const modals = mdlr_elements( '.mdlr-modal' );
const modalOpeners = mdlr_elements( '.mdlr-function-modal' );
const modalButtons = mdlr_elements( '.mdlr-function-modal-close' );

// Listener: close modals when you click on the 'dismiss' button
if( modalButtons ) {
    modalButtons.forEach( function( modalButton ) {
        modalButton.addEventListener( 'click', function( e ) {
            mdlr_modal_close();
        } );
        modalButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_modal_close();
                e.preventDefault();
            }
        });
    } );
}

// Listener: open modals on demand
if( modalOpeners ) {
    modalOpeners.forEach( function( modalOpener ) {
        modalOpener.addEventListener( 'click', function( e ) {
            mdlr_modal_open( e.currentTarget );
        } );
        modalOpener.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_modal_open( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Open a specific modal
function mdlr_modal_open( clickedElement) {

    // Get content from the data-target field
    var modalId = clickedElement.getAttribute( 'aria-controls' );;

    // Open the modal after a brief animation delay and set the scroll prevention
    var modal = document.getElementById( modalId );
    modal.hidden = false;
    setTimeout( function() {
        modal.classList.add( 'mdlr-variant-active' );
    }, 50);
    document.body.classList.add( 'mdlr-variant-modal' );

    // If the page contains a map, update the Leaflet.js sizing to avoid issues in case the modal shows a map
    if( mapModal ) {
        mapModal.invalidateSize();
    }

    // Focus the modal's close button for keyboard navigation
    setTimeout( function() {
        modal.querySelectorAll( 'button' )[0].focus();
    }, 350);
}

// Close all modals
function mdlr_modal_close() {

    // Remove the scroll prevention from the body
    document.body.classList.remove( 'mdlr-variant-modal' );

    // Close the modals themselves
    modals.forEach( function( modal ) {
        modal.classList.remove( 'mdlr-variant-active' );
    } );

    setTimeout( function() {
        modals.forEach( function( modal ) {
            if( modal.hidden == false ) {
                modal.hidden = true;

                // Return keyboard focus to the modal's opener
                document.getElementById( modal.getAttribute( 'aria-labelledby' ) ).focus();
            }
        } )
    }, 350);
}


/*
# Info Buttons ################################################################
*/

// Variable
const infoButtons = mdlr_elements( '.mdlr-function-info' );

// Listener: open popover when clicking on an info button
if( infoButtons ) {
    infoButtons.forEach( function( infoButton ) {
        infoButton.addEventListener( 'click', function( e ) {
            mdlr_info( e.currentTarget );
            e.preventDefault();
        } );
        infoButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_info( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Function to show an info popover
function mdlr_info( clickedElement ) {

    // Get the desired popover position
    let viewport = window.innerWidth;
    let offsetMin = 21; /* 1.4rem = 21px */
    let offsetAdditional = 7;
    let offsetWidth = 315; /* 19rem + 2rem = 315px */
    let position = clickedElement.getBoundingClientRect();
    let positionTop = position.top + window.scrollY + offsetMin + offsetAdditional;

    // Calculate whether the popover should be right-aligned
    if( ( position.left + window.scrollX ) > ( viewport * 0.5 ) ) {
        var positionLeft = position.left + window.scrollX - offsetWidth + offsetMin + offsetAdditional;
    }
    else {
        var positionLeft = position.left + window.scrollX - offsetAdditional;
    }

    // Identify the popover to open
    let targetID = clickedElement.href;
    targetID = targetID.substring( targetID.indexOf( '#' ) );
    let targets = mdlr_elements( targetID );

    // Position and show the desired popover
    targets.forEach( function( target ) {
        if( ! target.classList.contains( 'mdlr-variant-visible' ) ) {
        target.style['top'] = positionTop + 'px';
        target.style['left'] = positionLeft + 'px';
        setTimeout( function () {
            target.classList.add( 'mdlr-variant-visible' );
        }, 50 );

        // Set a one-time listener to close the popover on the next click
        setTimeout( function () {

            // Click outside the popover
            document.addEventListener( 'click', function( e ) {
                if( ! e.target.closest( '.mdlr-variant-visible' ) ) {
                    target.classList.remove( 'mdlr-variant-visible' );
                    document.removeEventListener( 'click' );
                }
            } );

            // Touch or swipe outside the popover
            window.addEventListener( 'touchstart', function( e ) {
                if( ! e.target.closest( '.mdlr-variant-visible' ) ) {
                    target.classList.remove( 'mdlr-variant-visible' );
                    document.removeEventListener( 'touchstart' );
                }
            } );

            // Window resize
            window.addEventListener( 'resize', function( e ) {
                target.classList.remove( 'mdlr-variant-visible' );
                document.removeEventListener( 'resize' );
            } );
        }, 200 );
        }
    } );
}


/*
# Map #########################################################################
*/

// Empty variables (established here so they can be used across functions)
var map = false;
var mapPhonebookEntries = false;
var mapHistoricalEntries = false;
var mapModal = false;
var mapModalPhonebookEntries = false;
var mapModalHistoricalEntries = false;

// Variables
const mapButtons = mdlr_elements( '.mdlr-function-map' );
const mapPhonebookCenter = [ 51.2657, 10.4515 ];
const mapHistoricalCenter = [ 51.5657, 13.2515 ];

// Listener: open popover when clicking on an info button
if( mapButtons ) {
    mapButtons.forEach( function( mapButton ) {
        mapButton.addEventListener( 'click', function( e ) {
            mdlr_map_toggle( e.currentTarget );
            e.preventDefault();
        } );
        mapButton.addEventListener( 'keydown', function( e ) {
            if( e.code == 'Enter' || e.code == 'Space' ) {
                mdlr_map_toggle( e.currentTarget );
                e.preventDefault();
            }
        });
    } );
}

// Main function to initialise a map and its modal map
function mdlr_map( type, phonebookData, historicalData ) {

    // Routine for standard entry maps
    if( type == 'entry' ) {

        // Define containers
        var container = 'distribution-map-leaflet';
        var containerModal = 'distribution-map-leaflet-modal';

        // Phonebook entries: in both maps, add a dedicated layer
        mapPhonebookEntries = L.layerGroup();
        mapModalPhonebookEntries = L.layerGroup();

        // Phonebook entries: add a circle per GeoJSON point feature
        mdlr_map_circle( 'phonebook', phonebookData ).addTo( mapPhonebookEntries );
        mdlr_map_circle( 'phonebook', phonebookData ).addTo( mapModalPhonebookEntries );

        // Historical entries: in both maps, add a dedicated layer
        if( historicalData ) {
            mapHistoricalEntries = L.layerGroup();
            mapModalHistoricalEntries = L.layerGroup();

            // Add a circle per GeoJSON point feature
            mdlr_map_circle( 'historical', historicalData ).addTo( mapHistoricalEntries );
            mdlr_map_circle( 'historical', historicalData ).addTo( mapModalHistoricalEntries );

            // Load GeoJSON data for the German border from 1871 to 1917
            fetch( 'data/border-historical.json' )
                .then( response => response.json() )
                .then( historicalBorder => {
                    mdlr_map_border( 'historical', historicalBorder ).addTo( mapHistoricalEntries );
                    mdlr_map_border( 'historical', historicalBorder ).addTo( mapModalHistoricalEntries );
                } );

            // Configure layer controls for the modal map
            var mapLayers = {};
            mapLayers[phonebookData.name] = mapModalPhonebookEntries;
            mapLayers[historicalData.name] = mapModalHistoricalEntries;
        }

        // Configure layer controls for the modal map in case there is no historical data
        else {
            var mapLayers = {};
            mapLayers[phonebookData.name] = mapModalPhonebookEntries;
        }

        // Set up the map and its modal map
        map = mdlr_map_initialise( container, mapPhonebookCenter, false );
        mapModal = mdlr_map_initialise( containerModal, mapPhonebookCenter, true );

        // Set up the map
        mdlr_map_tiles().addTo( map );
        map.addLayer( mapPhonebookEntries );

        // Set up the modal map
        mdlr_map_tiles().addTo( mapModal );
        mapModal.addLayer( mapModalPhonebookEntries );
        L.control.layers( false, mapLayers ).addTo( mapModal );

        // Reload map tiles in both maps when the window is resized and when the document is printed
        // Leaflet needs to know the changer container dimensions in these cases
        window.addEventListener( 'resize', function() {
            setTimeout( function() {
                map.invalidateSize();
                mapModal.invalidateSize();
            }, 350 );
        } );
        window.addEventListener( 'beforeprint', function() {
            setTimeout( function() {
                map.invalidateSize();
                mapModal.invalidateSize();
            }, 350 );
        } );
    }
}

// Helper function to initialise a map
function mdlr_map_initialise( container, center, controls ) {

    // Set up the map
    return L.map( container, {
        center: center,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        zoom: 5.5,
        zoomControl: controls
    } );
}

// Helper function to ass the tile layer to a map
function mdlr_map_tiles() {

    // Add a tile layer
    return L.tileLayer( 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
    } );
}

// Helper function to add a circle per entry
function mdlr_map_circle( type, feature ) {

    // Construct the circle
    return L.geoJSON( feature, {
        pointToLayer: function ( feature, coordinates ) {

            // Determine scale and colour (phonebook vs. historical)
            if( type == 'phonebook' ) {
                var scale = 250;
                var color = '#49ad0c';
            }
            else {
                var scale = 900;
                var color = '#e34a00';
            }

            // Determine size
            var size = feature.properties.count * scale;

            // Circle
            return L.circle( coordinates, {
                stroke: true,
                color: color,
                weight: 0,
                fillColor: color,
                fillOpacity: 0.9,
                radius: size
            });
        }
    } );
}

// Helper function to add a border
function mdlr_map_border( type, border ) {

    // Determine colour (phonebook vs. historical)
    if( type == 'phonebook' ) {
        var color = '#49ad0c';
    }
    else {
        var color = '#e34a00';
    }

    // Border as a GeoJSON object
    return L.geoJSON( border, {
        style: {
            color: color,
            weight: 2,
            opacity: 0.5
        }
    } );
}

// Function to toggle layers from outside the Leaflet map
function mdlr_map_toggle( clickedButton ) {

    // Deactivate all tabs and activate the clicked one
    mapButtons.forEach( function( mapButton ) {
        mapButton.classList.remove( 'mdlr-variant-active' );
    } );
    clickedButton.classList.add( 'mdlr-variant-active' );

    // Identify the target layer and activate only this one
    var target = clickedButton.dataset.target;
    if( target == 'phonebook' && map.hasLayer( mapHistoricalEntries ) ) {
        map.removeLayer( mapHistoricalEntries );
        map.addLayer( mapPhonebookEntries );
        map.panTo( mapPhonebookCenter, {
            duration: 1
        } );
    }
    else if( target == 'historical' && map.hasLayer( mapPhonebookEntries ) ) {
        map.removeLayer( mapPhonebookEntries );
        map.addLayer( mapHistoricalEntries );
        map.panTo( mapHistoricalCenter, {
            duration: 1
        } );
    }
}

// On pages with map data, activate the map
if ( typeof mapContent !== 'undefined' ) {
    if ( mapContent ) {

        // Activate entry maps
        if( mapContent.type == 'entry' ) {
            mdlr_map( mapContent.type, mapContent.phonebookData, mapContent.historicalData );
        }
    }
}
