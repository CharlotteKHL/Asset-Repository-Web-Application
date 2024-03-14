package com.team05.assetsrepo;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@ComponentScan(basePackages = {"com.team05.assetsrepo"})
@EnableWebSecurity
public class SecurityConfig {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  @Bean
  public CustomUserDetailsService customUserDetailsService() {
    return new CustomUserDetailsService(userRepository);
  }

  @Autowired
  public PasswordEncoder encoder() {
    return new BCryptPasswordEncoder();
  }

  @Autowired
  @Bean
  public DaoAuthenticationProvider authProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(customUserDetailsService());
    authProvider.setPasswordEncoder(encoder());
    return authProvider;
  }

  @Autowired
  @Bean
  public AuthenticationManager authManager(HttpSecurity http) throws Exception {
    return http.getSharedObject(AuthenticationManagerBuilder.class)
        .authenticationProvider(authProvider()).build();
  }

  @Autowired
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // First, specify the authorisation for specific paths
        .authorizeHttpRequests(authorize -> authorize.requestMatchers("/create-type/**")
            .hasAuthority("ADMIN").requestMatchers("/create-asset/**", "/manage-asset/**")
            .hasAnyAuthority("USER", "ADMIN").requestMatchers("/search-asset/**")
            .hasAnyAuthority("VIEWER", "USER", "ADMIN").requestMatchers("/register.html")
            .permitAll()
            // Permit access to specific static resources
            .requestMatchers("/custom.css", "/loginScript.js", "/registerScript.js").permitAll()
            .requestMatchers("/login").permitAll())
        // Next, configure form login
        .formLogin(form -> form.loginPage("/login.html").permitAll() // Allow everyone to see the
                                                                     // login page
        )
        // Configure logout
        .logout(logout -> logout.logoutSuccessUrl("/index.html").permitAll() // Allow everyone to
                                                                             // access logout
                                                                             // success URL
        )
        // Finally, handle all other requests
        .authorizeHttpRequests(authorize -> authorize.anyRequest().authenticated())
        // Disable CSRF if necessary
        .csrf(csrf -> csrf.disable());
    

    return http.build();
  }



}
