/* Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.devrel.samples.ttt.spi;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.users.User;
import com.google.devrel.samples.ttt.PMF;
import com.google.devrel.samples.ttt.Score;

/**
 * Defines v1 of a Score resource as part of the tictactoe API, which provides
 * clients the ability to insert and list scores.
 */
@Api(
    name = "tictactoe",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class ScoresV1 {
  private static final String WHEN = "1";
  private static final String OUTCOME = "2";
  
  private static final String DEFAULT_LIMIT = "10";
  
  /**
   * Provides the ability to query for a collection of Score entities.
   * 
   * @param limit maximum number of entries to return
   * @param order how the entries should be ordered
   * @param user object representing the current user making requests
   * @return the collection of Score entities
   * @throws OAuthRequestException if the token included in the request is
   *         invalid, the client ID included in the token is not in the list of
   *         allowed clientIds, or the audience included in the token is not in
   *         the list of allowed audiences.
   * @throws IOException
   */
  @ApiMethod(name = "scores.list")
  @SuppressWarnings("unchecked")
  public List<Score> list(@Nullable @Named("limit") String limit, @Nullable
      @Named("order") String order, User user) throws OAuthRequestException,
      IOException {
    PersistenceManager pm = getPersistenceManager();
    Query query = pm.newQuery(Score.class);
    if (order != null) {
      if (order.equals(WHEN)) {
        query.setOrdering("played desc");
      } else if (order.equals(OUTCOME)) {
        query.setOrdering("outcome asc");
      }
    } else {
      query.setOrdering("played desc");
    }
    
    if (user != null) {
      query.setFilter("player == userParam");
      query.declareParameters("com.google.appengine.api.users.User userParam");
    } else {
      throw new OAuthRequestException("Invalid user.");
    }
    
    if (limit == null) {
      limit = DEFAULT_LIMIT;
    }
    query.setRange(0, new Long(limit));
    
    return (List<Score>) pm.newQuery(query).execute(user);
  }
  
  /**
   * Provides the ability to insert a new Score entity.
   * 
   * @param score object representing the outcome to save
   * @param user object representing the current user making requests
   * @return the object that was saved
   * @throws OAuthRequestException if the token included in the request is
   *         invalid, the client ID included in the token is not in the list of
   *         allowed clientIds, or the audience included in the token is not in
   *         the list of allowed audiences.
   * @throws IOException
   */
  @ApiMethod(name = "scores.insert")
  public Score insert(Score score, User user) throws
      OAuthRequestException, IOException {
    if (user != null) {
      score.setPlayed(new Date());
      score.setPlayer(user);
      PersistenceManager pm = getPersistenceManager();
      pm.makePersistent(score);
      pm.close();
      return score;
    } else {
      throw new OAuthRequestException("Invalid user.");
    }
  }
  
  private static PersistenceManager getPersistenceManager() {
    return PMF.get().getPersistenceManager();
  }
}
