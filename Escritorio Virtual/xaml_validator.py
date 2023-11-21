import xml.etree.ElementTree as et
import sys


# OPEN ARCHIVES TO WRITE
def open_xaml(filename):
    with open('log.txt', 'w', encoding='utf8') as f:
        # Parse XAML
        tree = et.parse(filename + '.xaml')
        window = tree.getroot()

        # Create validator and log errors if there is any
        s = ValidatorXAML(f)
        s.log("File Selected: " + filename + ".xaml\n")
        treat_level(window, s)
        if s.get_errors() == 0:
            print(filename + ".xaml validation finished")
            print("The file is valid")
            s.no_errors()
        else:
            print(filename + ".xaml validation finished")
            print("The file is not valid")
            print(str(s.get_errors()) + " errors found")
            print("Check the file log.txt to see the errors")
            s.log("Errors in the file: " + str(s.get_errors()) + "\n")


class ValidatorXAML:
    errors = 0

    def __init__(self, f):
        self.f = f

    def header_error_file(self):
        self.f.write("--- ERRORS FOUNDED ---")

    def no_errors(self):
        self.f.write("--- YOUR FILE IS VALID ---")

    def log(self, prompt_message):
        self.f.write(prompt_message)

    def inc_error(self):
        self.errors += 1

    def get_errors(self):
        return self.errors


# OTHER NEEDED METHODS FOR HTML
def treat_level(branch, s):
    labels = branch.findall(
        '{http://schemas.microsoft.com/winfx/2006/xaml/presentation}Label')

    for label in labels:
        if label.attrib.get('Content') == "":
            s.inc_error()
            s.log("Label contained in " + branch.tag.split('}')[1] + " have empty content\n")

    triggers = branch.findall(
        '{http://schemas.microsoft.com/winfx/2006/xaml/presentation}Trigger')

    for trigger in triggers:
        if trigger.attrib.get('Property') == "":
            s.inc_error()
            s.log("Trigger contained in " + branch.tag.split('}')[1] + " does not have any property\n")
        if trigger.attrib.get('Value') != "True" and trigger.attrib.get('Value') != "False":
            s.inc_error()
            s.log("Trigger contained in " + branch.tag.split('}')[1] + " have invalid value\n")

    buttons = branch.findall(
        '{http://schemas.microsoft.com/winfx/2006/xaml/presentation}Button')

    for button in buttons:
        if button.attrib.get('Content') == "":
            s.inc_error()
            s.log("Button contained in " + branch.tag.split('}')[1] + " have empty content\n")
        if button.attrib.get('Height') is not None:
            if int(button.attrib.get('Height')) >= 100 or int(button.attrib.get('Height')) <= 0:
                s.inc_error()
                s.log("Button contained in " + branch.tag.split('}')[1] + " have a height bigger than"
                                                                          " the recommended\n")
        if button.attrib.get('Width') is not None:
            if int(button.attrib.get('Width')) >= 200 or int(button.attrib.get('Width')) <= 0:
                s.inc_error()
                s.log("Button contained in " + branch.tag.split('}')[1] + " have a height bigger than"
                                                                          " the recommended\n")

    panels = branch.findall(
        '{http://schemas.microsoft.com/winfx/2006/xaml/presentation}StackPanel')

    for panel in panels:
        if len(panel) == 0:
            s.inc_error()
            s.log("Panel contained in " + branch.tag.split('}')[1] + " have empty content\n")

    for child in branch:
        treat_level(child, s)


def main():
    print("Type the name of the file to validate: ")
    print("Type 'exit' if you want to exit the program")
    filename = input("--> ")
    if filename.upper() == "EXIT":
        sys.exit(0)
    try:
        open_xaml(filename)
        another_validation()
        input("Press any key to continue...")
        sys.exit()
    except FileNotFoundError:
        print('The file does not exist')
        main()


def another_validation():
    print("Do you want to validate another document?")
    print("y = yes | n = no")
    option = input("--> ").lower()
    if option == "yes" or option == "y":
        main()
    elif option == "no" or option == "n":
        sys.exit(0)
    else:
        another_validation()


# START THE PROGRAM
main()
