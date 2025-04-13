from django.test import LiveServerTestCase
import time
from django.contrib.staticfiles.testing import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class Imgtest(LiveServerTestCase):
    def test_img_exists_multiple_browsers(self):
            browsers = {
                "Chrome": webdriver.Chrome,
                "Edge": webdriver.Edge,
                }
            for browser_name, browser_driver in browsers.items():
                with self.subTest(browser=browser_name):
                    driver = browser_driver()
                    try:
                        driver.get("http://209.38.128.48/")

                        logo_element = WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, "//img[@alt='Logo']"))
                            )

                        assert logo_element.get_attribute("alt") == "Logo"
                    finally:
                        driver.quit()

class LoginInputsTest(LiveServerTestCase):
    def test_login_inputs_exist_multiple_browsers(self):
        browsers = {
            "Chrome": webdriver.Chrome,
            "Edge": webdriver.Edge,
            }
        for browser_name, browser_driver in browsers.items():
            with self.subTest(browser=browser_name):
                driver = browser_driver()
                try:
                    driver.get("http://209.38.128.48/")

                    username_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.ID, "username"))
                        )

                    password_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.ID, "password"))
                        )
            
                    self.assertIsNotNone(username_input)
                    self.assertIsNotNone(password_input)
                finally:
                    driver.quit()

class LoginFormTest(LiveServerTestCase):
        def test_login_form_multiple_browsers(self):
            browsers = {
                "Chrome": webdriver.Chrome,
                "Edge": webdriver.Edge,
                }
            for browser_name, browser_driver in browsers.items():
                with self.subTest(browser=browser_name):
                    driver = browser_driver()
                    try:
                        driver.get("http://209.38.128.48/")
                    
                        username_input = driver.find_element(By.ID, "username")
                        password_input = driver.find_element(By.ID, "password")
                        username_input.send_keys("tcrow")
                        password_input.send_keys("Spearmint#42")
                    
                        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
                        submit_button.click()

                        WebDriverWait(driver, 20).until(
                        EC.text_to_be_present_in_element((By.XPATH, "//span[contains(text(), 'Welcome,')]"), "Taylor")
                        )
                        assert "Taylor" in driver.page_source
            
                    finally:
                        driver.quit()

class AddUserTest(LiveServerTestCase):
    def test_add_user_multiple_browsers(self):

        base_url = "http://209.38.128.48"
        browsers = {
            "Chrome": webdriver.Chrome,
            "Edge": webdriver.Edge,
        }
    
        for browser_name, browser_driver in browsers.items():
            with self.subTest(browser=browser_name):
                driver = browser_driver()
                try:
                    print(f"Starting test with {browser_name}")
                    driver.get(f"{base_url}/login")
                    
                    wait = WebDriverWait(driver, 10)
                    wait.until(EC.presence_of_element_located((By.ID, "username")))
                    wait.until(EC.presence_of_element_located((By.ID, "password")))
                    
                    driver.find_element(By.ID, "username").send_keys("tcrow")
                    driver.find_element(By.ID, "password").send_keys("Spearmint#42")
                    driver.find_element(By.XPATH, "//button[@type='submit']").click()
                    print(f"{browser_name}: Logged in successfully")
                    
                    wait.until(EC.presence_of_element_located((By.XPATH, "//a[@href='/manage-users']")))
                    driver.find_element(By.XPATH, "//a[@href='/manage-users']").click()
                    print(f"{browser_name}: Navigated to manage users")
                    
                    unique_id = str(int(time.time()))[-6:]
                    test_username = f"jsein{unique_id}"
                    test_email = f"jerry{unique_id}@monks.com"
                    print(f"{browser_name}: Generated test username: {test_username}")
                    
                    add_user_button = wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//button[contains(text(), 'Add User')]")
                    ))
                    driver.execute_script("arguments[0].click();", add_user_button)
                    print(f"{browser_name}: Clicked Add User button")
                    
                    username_field = wait.until(EC.presence_of_element_located(
                        (By.XPATH, "//input[@placeholder='Username']")
                    ))
                    print(f"{browser_name}: Add User dialog opened")
                    
                    username_field.send_keys(test_username)
                    driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys("driverpass9")
                    driver.find_element(By.XPATH, "//input[@placeholder='Email']").send_keys(test_email)
                    driver.find_element(By.XPATH, "//input[@placeholder='First Name']").send_keys("Jerry")
                    driver.find_element(By.XPATH, "//input[@placeholder='Last Name']").send_keys("Seinfeld")
                    driver.find_element(By.XPATH, "//input[@placeholder='Employee ID']").send_keys(unique_id)
                    driver.find_element(By.XPATH, "//input[@placeholder='Address']").send_keys("44 Long Island Rd.")

                    dl_number = unique_id[:5] + "12345"
                    driver.find_element(By.XPATH, "//input[@placeholder='Driver License']").send_keys(dl_number)
                    print(f"{browser_name}: Filled in user details")
                    
                    time.sleep(2)
                    
                    buttons = driver.find_elements(By.TAG_NAME, "button")
                    print(f"{browser_name}: Found {len(buttons)} buttons on page")
                    form_buttons = []
                    for btn in buttons:
                        btn_text = btn.text.strip()
                        btn_position = driver.execute_script("return arguments[0].getBoundingClientRect();", btn)
                        print(f"{browser_name}: Button '{btn_text}' at y={btn_position['y']}")
                        form_buttons.append((btn, btn_position['y'], btn_text))
                    
                    form_buttons.sort(key=lambda x: x[1], reverse=True)
                    
                    submission_button = None
                    for btn, pos, text in form_buttons:
                        if (('add' in text.lower() and 'user' in text.lower()) or 
                            'submit' in text.lower() or 'create' in text.lower()):
                            submission_button = btn
                            print(f"{browser_name}: Found likely submission button: '{text}'")
                            break
                    
                    if not submission_button and form_buttons:
                        submission_button = form_buttons[0][0]
                        print(f"{browser_name}: Using lowest button on page: '{form_buttons[0][2]}'")
                    
                    if not submission_button:
                        forms = driver.find_elements(By.TAG_NAME, "form")
                        if forms:
                            form_buttons = forms[0].find_elements(By.TAG_NAME, "button")
                            if form_buttons:
                                submission_button = form_buttons[-1]
                                print(f"{browser_name}: Using last button in form: '{submission_button.text}'")
                    
                    if not submission_button:
                        raise Exception("Could not find a valid submission button")
                    
                    print(f"{browser_name}: About to click submission button")
                    driver.execute_script("arguments[0].click();", submission_button)
                    print(f"{browser_name}: Clicked submission button")
                    
                    time.sleep(2)
                    
                    try:
                        alert = driver.switch_to.alert
                        alert_text = alert.text
                        print(f"{browser_name}: First alert detected: {alert_text}")
                        self.assertIn("Are you sure you want to add this user?", alert_text,
                                      "Confirm alert did not show expected text.")
                        alert.accept()
                    except Exception as e:
                        print(f"{browser_name}: No confirm alert detected: {str(e)}")
                    
                    time.sleep(2)
                    
                    try:
                        alert = driver.switch_to.alert
                        second_alert_text = alert.text
                        print(f"{browser_name}: Second alert detected: {second_alert_text}")
                        self.assertIn("User successfully added", second_alert_text,
                                      "Success alert did not show expected text.")
                        alert.accept()
                    except Exception as e:
                        print(f"{browser_name}: No success alert detected: {str(e)}")
                    
                    try:
                        close_btn = wait.until(EC.element_to_be_clickable(
                            (By.XPATH, "//button[contains(text(), 'Close')]")
                        ))
                        close_btn.click()
                        print(f"{browser_name}: Clicked popup close button")
                    except Exception as e:
                        print(f"{browser_name}: Could not click popup close button: {str(e)}")
                    
                    time.sleep(3)
                    
                    driver.get(f"{base_url}/manage-users")
                    print(f"{browser_name}: Re-navigated to manage users to refresh the view")
                    
                    try:
                        user_cell = WebDriverWait(driver, 30).until(
                            EC.visibility_of_element_located((By.XPATH, f"//td[contains(text(), '{test_username}')]"))
                        )
                        print(f"{browser_name}: SUCCESS! Username {test_username} found in the table.")
                        self.assertTrue(True)
                    except TimeoutException:
                        print(f"{browser_name}: Username {test_username} was NOT found in the table after waiting.")
                        driver.save_screenshot("table_verification_failed.png")
                        self.fail(f"User {test_username} was not added successfully in {browser_name}")
                
                except Exception as e:
                    print(f"{browser_name}: Exception: {str(e)}")
                    driver.save_screenshot("test_failed.png")
                    self.fail(f"Test failed with exception: {str(e)}")
                
                finally:
                    print(f"{browser_name}: Test completed, quitting driver")
                    driver.quit()
