tell application "Safari"
    activate
    set theURL to "http://localhost:8080/generate-icons.html"
    if (count of windows) = 0 then
        make new document
    end if
    set URL of current tab of front window to theURL
    delay 3
    tell application "System Events"
        tell process "Safari"
            try
                click button "Generate All Icons" of group 1 of group 1 of tab group 1 of splitter group 1 of window 1
            on error
                -- Try alternative button location
                click button "Generate All Icons"
            end try
        end tell
    end tell
end tell
