export LD_LIBRARY_PATH=".:$LD_LIBRARY_PATH./libadatper:./libv8c"
erl +sbt ns +sub true -boot start_sasl -config sasl -setcookie abc -name yszz@127.0.0.1 -env ERL_LIBS ../lib +pc unicode  -detached
